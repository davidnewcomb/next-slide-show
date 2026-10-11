'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import {
	BROWSER_IMAGE_DIR, PAUSE,
	SS_PAUSE,
	SS_BACK, SS_FORWARD,
	SS_ROTATE_180, SS_ROTATE_P90, SS_ROTATE_N90,
	SS_WIDTH_SMALLER, SS_WIDTH_BIGGER, SS_WIDTH_MAX,
	SS_FAV, SS_SWITCH_TO_FAVS,
	SS_CFG_LOAD, SS_CFG_SAVE,
	SS_CONTROL_PANEL, SS_CONTROL_PANEL_STYLE,
	SS_BACK_CURSOR,
	SS_FORWARD_CURSOR,
	SS_CFG_DUP
} from './cfg'
import ControlPanel from './ControlPanel'
import Status from './Status'
import ProgressBar from './ProgressBar'
import SavePage from './SavePage'
import LoadPage from './LoadPage'

const PAUSED_FOREVER = 0

const doRotation = (currentDegs, addRotation) => {
	let s = currentDegs + addRotation
	if (s >= 360) {
		return s - 360
	}
	if (s < 0) {
		return s + 360
	}
	return s
}

const styleToClass = (s) => {
	return s ? 'none' : 'responsive'
}

const round = (n) => Math.round(n * 1000) / 1000

// The stored rotation is anti-clockwise (that is how jimp used to apply it when
// the images were transformed on the server), css rotate() turns clockwise, so
// the angle is negated on the way out. Old cfg files keep looking the same.
const cssRotation = (deg) => round(-deg)

// Size of the box a w x h image needs once it has been rotated.
const boundingBox = (w, h, deg) => {
	const rad = deg * Math.PI / 180
	const c = Math.abs(Math.cos(rad))
	const s = Math.abs(Math.sin(rad))
	return { w: round(w * c + h * s), h: round(w * s + h * c) }
}

const imageSrc = (item, dir) => {
	if (item.src.startsWith('http')) {
		return item.src
	}
	return BROWSER_IMAGE_DIR + item.src + '?dir=' + encodeURI(dir)
}

// Turns the measured image into the css needed to show it rotated and scaled.
// The image is rotated about its centre inside a wrapper big enough to hold the
// rotated result, so the document still scrolls as if the file itself had been
// transformed.
const geometry = (sh) => {
	if (!sh || !sh.w || !sh.h) {
		return null
	}
	const deg = cssRotation(sh.rotate)
	const centre = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		height: 'auto',
		transform: `translate(-50%, -50%) rotate(${deg}deg)`
	}

	if (sh.style) {
		// natural size, magnified by widthPercent
		const iw = round(sh.w * sh.widthPercent / 100)
		const ih = round(sh.h * sh.widthPercent / 100)
		const box = boundingBox(iw, ih, sh.rotate)
		return {
			wrapper: { position: 'relative', width: `${box.w}px`, height: `${box.h}px` },
			img: { ...centre, width: `${iw}px` }
		}
	}

	// the rotated image is fitted to the width of the window
	const box = boundingBox(sh.w, sh.h, sh.rotate)
	return {
		wrapper: { position: 'relative', width: '100%', aspectRatio: `${box.w} / ${box.h}` },
		img: { ...centre, width: `${round(sh.w / box.w * 100)}%` }
	}
}
const cloneImageStateListItem = (li) => {
	const o = { ...li }
	o.cfg = { ...li.cfg }
	o.cfg.scroll = { ...li.cfg.scroll }
	return o
}

const cloneImageState = (is) => {
	if (!is) {
		return is
	}
	const o = { ...is }
	o.cfg = { ...is.cfg }
	o.admin = { ...is.admin }
	o.list = is.list.map(i => cloneImageStateListItem(i))
	return o
}

export default function Slideshow() {

	const [currentIndex, setCurrentIndex] = useState(0)
	const [timeoutValue, setTimeoutValue] = useState(PAUSE)
	const [controlPanelStyle, setControlPanelStyle] = useState(false)
	const [showFavourites, setShowFavourites] = useState(false)
	const [showControlPanel, setShowControlPanel] = useState(true)
	const [imageState, setImageState] = useState(null)
	const [loadCfg, setLoadCfg] = useState(false)
	const [saveCfg, setSaveCfg] = useState(false)
	// measurements and settings of the image currently painted, which is the
	// previous one while the next file is still downloading
	const [shown, setShown] = useState(null)
	const imageStateRef = useRef(null)

	const current = (imageState && !loadCfg && !saveCfg) ? imageState.list[currentIndex] : null
	const curSrc = current ? imageSrc(current, imageState.cfg.dir) : null
	const curRotate = current ? current.cfg.rotate : 0
	const curWidthPercent = current ? current.cfg.widthPercent : 100
	const curStyle = current ? current.cfg.style : false

	useEffect(() => {
		imageStateRef.current = imageState
	}, [imageState])

	const nextFavIdx = useCallback((idx, stuff) => {
		let nextId = idx + 1
		if (nextId > stuff.length) {
			nextId = 0
		}
		for (let i = nextId; i < stuff.length; ++i) {
			if (!showFavourites || stuff[i].fav) {
				return i
			}
		}
		for (let i = 0; i < stuff.length; ++i) {
			if (!showFavourites || stuff[i].fav) {
				return i
			}
		}

		console.log('No next id!!!')
		return 0
	}, [showFavourites])

	const prevFavIdx = useCallback((idx, stuff) => {
		let prevId = idx - 1
		if (prevId === -1) {
			prevId = stuff.length - 1
		}
		for (let i = prevId; i > -1; --i) {
			if (!showFavourites || stuff[i].fav) {
				return i
			}
		}
		for (let i = stuff.length - 1; i > -1; --i) {
			if (!showFavourites || stuff[i].fav) {
				return i
			}
		}

		console.log('No prev id!!!')
		return 0
	}, [showFavourites])

	const nextSlide = useCallback(() => {
		if (!imageState) {
			return
		}
		const nId = nextFavIdx(currentIndex, imageState.list)
		setCurrentIndex(nId)
	}, [currentIndex, imageState, nextFavIdx])

	const prevSlide = useCallback(() => {
		if (!imageState) {
			return
		}
		const nId = prevFavIdx(currentIndex, imageState.list)
		setCurrentIndex(nId)
	}, [currentIndex, imageState, prevFavIdx])

	const rotation = useCallback((deg) => {
		if (!imageState) {
			return
		}
		const is = cloneImageState(imageState)
		is.list[currentIndex].cfg.rotate = doRotation(is.list[currentIndex].cfg.rotate, deg)
		setImageState(is)
	}, [currentIndex, imageState])

	const width = useCallback((w) => {
		if (!imageState) {
			return
		}
		const is = cloneImageState(imageState)
		const newWidth = w === null ? 100 : Math.max(10, is.list[currentIndex].cfg.widthPercent + w)
		is.list[currentIndex].cfg.widthPercent = newWidth
		setImageState(is)
	}, [currentIndex, imageState])

	const toggleFavourite = useCallback(() => {
		if (!imageState) {
			return
		}
		const is = cloneImageState(imageState)
		is.list[currentIndex].fav = !is.list[currentIndex].fav
		setImageState(is)
	}, [currentIndex, imageState])

	const duplicate = useCallback(() => {
		if (!imageState) {
			return
		}
		const is = cloneImageState(imageState)
		is.list.splice(currentIndex, 0, is.list[currentIndex])
		setImageState(is)
		setCurrentIndex(currentIndex + 1)
	}, [currentIndex, imageState])

	const handleKeyPress = useCallback((event) => {

		// TODO make a switch statement

		if (event.key === SS_FORWARD || event.key === SS_FORWARD_CURSOR) {
			nextSlide()
		} else if (event.key === SS_BACK || event.key === SS_BACK_CURSOR) {
			prevSlide()
		} else if (event.key === SS_ROTATE_180) {
			rotation(180)
		} else if (event.key === SS_ROTATE_N90) {
			rotation(-90)
		} else if (event.key === SS_ROTATE_P90) {
			rotation(90)
		} else if (event.key === SS_WIDTH_SMALLER) {
			width(-10)
		} else if (event.key === SS_WIDTH_BIGGER) {
			width(10)
		} else if (event.key === SS_WIDTH_MAX) {
			width(null)
		} else if (event.key === SS_PAUSE) {
			setTimeoutValue(tv => tv === PAUSED_FOREVER ? PAUSE : PAUSED_FOREVER)
		} else if (event.key === SS_FAV) {
			toggleFavourite()
		} else if (event.key === SS_SWITCH_TO_FAVS) {
			setShowFavourites(it => !it)
		} else if (event.key === SS_CFG_LOAD) {
			setTimeoutValue(PAUSED_FOREVER)
			if (saveCfg) {
				setSaveCfg(false)
			}
			setLoadCfg(true)
		} else if (event.key === SS_CFG_DUP) {
			duplicate()
		} else if (event.key === SS_CFG_SAVE) {
			setTimeoutValue(PAUSED_FOREVER)
			if (loadCfg) {
				setLoadCfg(false)
			}
			setSaveCfg(true)
		} else if (event.key === SS_CONTROL_PANEL) {
			setShowControlPanel(it => !it)
		} else if (event.key === SS_CONTROL_PANEL_STYLE) {
			setControlPanelStyle(it => !it)
		}
	}, [nextSlide, prevSlide, rotation, width, toggleFavourite, duplicate])

	const scrollHandler = useCallback(() => {
		if (loadCfg || saveCfg) {
			return
		}
		if (imageState) {
			const is = cloneImageState(imageState)
			is.list[currentIndex].cfg.scroll = { t: parseInt(document.documentElement.scrollTop), l: parseInt(document.documentElement.scrollLeft) }
			setImageState(is)
		}

	}, [currentIndex, imageState])

	const onClickHandler = useCallback(() => {
		if (!imageState) {
			return
		}
		const is = cloneImageState(imageState)
		is.list[currentIndex].cfg.style = !is.list[currentIndex].cfg.style
		setImageState(is)
	}, [currentIndex, imageState])

	const onLoadHandler = useCallback((event) => {
		if (!curSrc) {
			return
		}
		const img = event.currentTarget
		setShown({
			src: curSrc,
			w: img.naturalWidth,
			h: img.naturalHeight,
			rotate: curRotate,
			widthPercent: curWidthPercent,
			style: curStyle
		})
	}, [curSrc, curRotate, curWidthPercent, curStyle])

	const onErrorHandler = useCallback(() => {
		if (!curSrc) {
			return
		}
		setShown({ src: curSrc, w: 0, h: 0, rotate: curRotate, widthPercent: curWidthPercent, style: curStyle })
	}, [curSrc, curRotate, curWidthPercent, curStyle])

	// rotating or resizing no longer reloads the file, so the settings of the
	// painted image are refreshed here instead of waiting for an onLoad
	useEffect(() => {
		setShown(s => (s && s.src === curSrc)
			? { ...s, rotate: curRotate, widthPercent: curWidthPercent, style: curStyle }
			: s)
	}, [curSrc, curRotate, curWidthPercent, curStyle])

	// put the window back where it was once the image is on screen at its
	// final size, which is also what makes the saved scroll position work
	useEffect(() => {
		if (!curSrc || !shown || shown.src !== curSrc) {
			return
		}
		const li = imageStateRef.current?.list?.[currentIndex]
		if (!li) {
			return
		}
		window.scrollTo({ left: li.cfg.scroll.l, top: li.cfg.scroll.t, behavior: 'instant' })
	}, [shown, curSrc, currentIndex])

	const loadObj = useCallback((obj, resetIndex = true) => {
		setImageState(obj)
		if (resetIndex) {
			setCurrentIndex(0)
		}
		//setTimeoutValue(PAUSE)
	}, [])

	const scrollHandlerController = useCallback((enable) => {
		if (enable) {
			document.addEventListener('scroll', scrollHandler)
		} else {
			document.removeEventListener('scroll', scrollHandler)
		}

	}, [scrollHandler]);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyPress)
		document.addEventListener('scroll', scrollHandler)

		return () => {
			document.removeEventListener('keydown', handleKeyPress)
			document.removeEventListener('scroll', scrollHandler)
		}
	}, [handleKeyPress, scrollHandler])

	useEffect(() => {
		if (!imageState) {
			return
		}
		let timer = null
		if (timeoutValue > 0) {
			timer = setTimeout(nextSlide, timeoutValue)
		}

		return () => {
			if (timer) {
				clearTimeout(timer)
			}
		}
	}, [timeoutValue, imageState, nextSlide])

	if (!imageState || loadCfg) {
		return <LoadPage loadObj={loadObj} scrollHandlerController={scrollHandlerController} close={() => {
			setLoadCfg(false)
			setTimeoutValue(PAUSE)
		}} cfg={imageState?.cfg} admin={imageState?.admin} />
	}

	if (saveCfg) {
		return <SavePage data={imageState} loadObj={loadObj} scrollHandlerController={scrollHandlerController} close={() => {
			setSaveCfg(false)
			setTimeoutValue(PAUSE)
		}} />
	}

	const thisOne = imageState.list[currentIndex]
	const thisOneCfg = thisOne.cfg

	let scTop = thisOneCfg.scroll.t
	let scLeft = thisOneCfg.scroll.l
	let widthPercent = thisOneCfg.widthPercent
	let rotate = thisOneCfg.rotate
	let style = thisOneCfg.style
	let isFav = thisOne.fav === true

	// the file is always fetched untouched, every transformation is css
	const geom = geometry(shown)

	const imgProps = {
		src: curSrc,
		style: geom ? geom.img : { width: '100%', height: 'auto' },
		onClick: onClickHandler,
		alt: `Slide ${currentIndex}`,
		onLoad: onLoadHandler,
		onError: onErrorHandler
	}

	// document.documentElement.scrollTop = imageState[currentIndex].cfg.scrollTop
	// document.documentElement.scrollLeft = imageState[currentIndex].cfg.scrollLeft

	const statusText =
		(showFavourites ? '[Favs] ' : '[All] ')
		+ (currentIndex + 1) + ' / ' + imageState.list.length
		//+ ' : ' + imageState.list[currentIndex]
		+ (rotate > 0 ? ' [' + rotate + 'deg]' : '')
		+ (widthPercent !== 100 ? ` ${widthPercent}%` : '')
		+ (timeoutValue === PAUSED_FOREVER ? ' [paused]' : '')
		+ ' ' + styleToClass(style)
		+ (scTop ? ' scT=' + scTop : '')
		+ (scLeft ? ' scL=' + scLeft : '')
		+ (isFav ? ' [fav]' : '')

	// Debug
	if (false) {
		let db = []
		for (let i = 0; (i < imageState.list.length - 1) && (db.length < 2); ++i) {
			if (imageState.list[i].fav) {
				db = [...db, imageState.list[i]]
			}
		}
		console.log('--')
		console.log(JSON.stringify(db, null, 4))
	}

	const max = imageState ? imageState.list.length - 1 : 0

	return (
		<div>
			<ProgressBar cur={currentIndex} max={max} setCurrentIndex={setCurrentIndex} />
			{showControlPanel && <ControlPanel handleKeyPress={handleKeyPress} fav={isFav} controlPanelStyle={controlPanelStyle} />}
			<Status statusText={statusText} fav={isFav} />
			<div className={styleToClass(style)} style={geom ? geom.wrapper : undefined}>
				<img {...imgProps} />
			</div>
		</div>
	)
}
