'use client'

import { useEffect, useState, useCallback } from 'react'
import {
	BROWSER_IMAGE_DIR, PAUSE,
	SS_PAUSE,
	SS_BACK, SS_FORWARD,
	SS_ROTATE_180, SS_ROTATE_P90, SS_ROTATE_N90,
	SS_WIDTH_SMALLER, SS_WIDTH_BIGGER, SS_WIDTH_MAX,
	SS_FAV, SS_SWITCH_TO_FAVS,
	SS_CFG_LOAD, SS_CFG_SAVE,
	SS_CONTROL_PANEL,
	SS_BACK_CURSOR,
	SS_FORWARD_CURSOR
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
const cloneImageStateListItem = (li) => {
	const o = {...li}
	o.cfg = {...li.cfg}
	o.cfg.scroll = { ...li.cfg.scroll }
	return o
}

const cloneImageState = (is) => {
	const o = { ...is }
	o.cfg = { ...is.cfg }
	o.admin = { ...is.admin }
	o.list = is.list.map(i => cloneImageStateListItem(i))
	return o
}

export default function Slideshow() {

	const [currentIndex, setCurrentIndex] = useState(0)
	const [timeoutValue, setTimeoutValue] = useState(PAUSE)
	const [showFavourites, setShowFavourites] = useState(false)
	const [showControlPanel, setShowControlPanel] = useState(true)
	const [imageState, setImageState] = useState(null)
	const [loadCfg, setLoadCfg] = useState(false)
	const [saveCfg, setSaveCfg] = useState(false)

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
		for (let i = stuff.length-1; i > -1 ; --i) {
			if (!showFavourites || stuff[i].fav) {
				return i
			}
		}

		console.log('No prev id!!!')
		return 0
	}, [showFavourites])

	const nextSlide = useCallback(() => {
		const nId = nextFavIdx(currentIndex, imageState.list)
		setCurrentIndex(nId)
	}, [currentIndex, imageState, nextFavIdx])

	const prevSlide = useCallback(() => {
		const nId = prevFavIdx(currentIndex, imageState.list)
		setCurrentIndex(nId)
	}, [currentIndex, imageState, prevFavIdx])

	const rotation = useCallback((deg) => {
		if (!imageState.list) {
			return
		}
		const is = cloneImageState(imageState)
		is.list[currentIndex].cfg.rotate = doRotation(is.list[currentIndex].cfg.rotate, deg)
		setImageState(is)
	}, [currentIndex, imageState])

	const width = useCallback((w) => {
		if (!imageState.list) {
			return
		}
		const is = cloneImageState(imageState)
		const newWidth = w === null ? 100 : is.list[currentIndex].cfg.widthPercent + w
		is.list[currentIndex].cfg.widthPercent = newWidth
		setImageState(is)
	}, [currentIndex, imageState])

	const toggleFavourite = useCallback(() => {
		const is = cloneImageState(imageState)
		is.list[currentIndex].fav = !is.list[currentIndex].fav
		setImageState(is)
	}, [currentIndex, imageState])

	const handleKeyPress = useCallback((event) => {
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
			setShowFavourites( it => !it )
		} else if (event.key === SS_CFG_LOAD) {
			setTimeoutValue(PAUSED_FOREVER)
			if (saveCfg) {
				setSaveCfg(false)
			}
			setLoadCfg(true)
		} else if (event.key === SS_CFG_SAVE) {
			setTimeoutValue(PAUSED_FOREVER)
			if (loadCfg) {
				setLoadCfg(false)
			}
			setSaveCfg(true)
		} else if (event.key === SS_CONTROL_PANEL) {
			setShowControlPanel(it => !it)
		}
	}, [nextSlide, prevSlide, rotation, width, toggleFavourite])

	const scrollHandler = useCallback(() => {
		if (loadCfg || saveCfg) {
			return
		}
		if (imageState) {
			const is = cloneImageState(imageState)
			is.list[currentIndex].cfg.scroll = { t: parseInt(document.documentElement.scrollTop), l: parseInt(document.documentElement.scrollLeft)}
			console.log('scrollHandler=', is.list[currentIndex].cfg.scroll)
			setImageState(is)
		}

	}, [currentIndex, imageState])

	const onClickHandler = useCallback(() => {
		const is = cloneImageState(imageState)
		is.list[currentIndex].cfg.style = !is.list[currentIndex].cfg.style
		setImageState(is)
	}, [currentIndex, imageState])

	const onLoadHandler = useCallback(() => {
		const scT = imageState.list[currentIndex].cfg.scroll.t
		const scL = imageState.list[currentIndex].cfg.scroll.l
		window.scrollTo(scL, scT)
	}, [currentIndex, imageState])

	const loadObj = useCallback((obj) => {
		setImageState(obj)
		setCurrentIndex(0)
		//setTimeoutValue(PAUSE)
	}, [])

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
		//setTimeoutValue(PAUSED_FOREVER)
		document.removeEventListener('scroll', scrollHandler)
		return <LoadPage loadObj={loadObj} close={() => {
			setLoadCfg(false)
			setTimeoutValue(PAUSE)
			document.addEventListener('scroll', scrollHandler)
		}} cfg={imageState?.cfg} admin={imageState?.admin}/>
	}

	if (saveCfg) {
		document.removeEventListener('scroll', scrollHandler)
		return <SavePage data={imageState} loadObj={loadObj} close={() => {
			setSaveCfg(false)
			setTimeoutValue(PAUSE)
			document.addEventListener('scroll', scrollHandler)
		}} />
	}

	const srcProps = {
		style: {}
	}

	const thisOne = imageState.list[currentIndex]
	const thisOneCfg = thisOne.cfg

	let scTop = thisOneCfg.scroll.t
	let scLeft = thisOneCfg.scroll.l
	let widthPercent = thisOneCfg.widthPercent
	let rotate = thisOneCfg.rotate
	let style = thisOneCfg.style
	let isFav = thisOne.fav === true

	if (imageState.list[currentIndex].src.startsWith('http')) {
		if (widthPercent !== 100) {
			srcProps.style.width = widthPercent + '%'
		}
		if (rotate !== 0) {
			srcProps.style.rotate = rotate + 'deg'
		}
		srcProps.src = thisOne.src
	} else {
		srcProps.src = BROWSER_IMAGE_DIR + thisOne.src + '?rotate=' + thisOneCfg.rotate + '&width=' + thisOneCfg.widthPercent + '&dir=' + encodeURI(imageState.cfg.dir)
	}

	const imgProps = {
		//src: BROWSER_IMAGE_DIR + images[currentIndex] + '?rotate=' + rotate + '&width=' + widthPercent,
		//src: images[currentIndex],
		...srcProps,
		className: styleToClass(style),
		onClick: onClickHandler,
		alt: `Slide ${currentIndex}`,
		onLoad: onLoadHandler // reset timer
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

	const max = imageState ? imageState.list.length : 0

	return (
		<div>
			<ProgressBar cur={currentIndex} max={max} setCurrentIndex={setCurrentIndex}/>
			{showControlPanel && <ControlPanel handleKeyPress={handleKeyPress} fav={isFav}/>}
			<Status statusText={statusText} fav={isFav} />
			<img {...imgProps} />
		</div>
	)
}
