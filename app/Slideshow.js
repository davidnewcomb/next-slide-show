'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
	BROWSER_IMAGE_DIR, PAUSE,
	SS_PAUSE,
	SS_BACK, SS_FORWARD,
	SS_ROTATE_180, SS_ROTATE_P90, SS_ROTATE_N90,
	SS_WIDTH_SMALLER, SS_WIDTH_BIGGER, SS_WIDTH_MAX,
	IMAGE_CLASS_NAMES
} from './cfg'
import Link from 'next/link'

const LONG_PAUSE = 0

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

const keys = [
	{ key: SS_BACK, title: '<' },
	{ key: SS_FORWARD, title: '>' },
	{ key: SS_PAUSE, title: 'P' },
	{ key: SS_WIDTH_SMALLER, title: 'v' },
	{ key: SS_WIDTH_MAX, title: '-' },
	{ key: SS_WIDTH_BIGGER, title: '^' },
	{ key: SS_ROTATE_P90, title: '-90' },
	{ key: SS_ROTATE_N90, title: '+90' },
	{ key: SS_ROTATE_180, title: '180' }
]

export default function Slideshow(props) {
	const { images } = props

	const [currentIndex, setCurrentIndex] = useState(0)
	const [rotate, setRotate] = useState(0)
	const [widthPercent, setWidthPercent] = useState(100)
	const [loaded, setLoaded] = useState(0)
	const [style, setStyle] = useState(0)
	const [timeoutValue, setTimeoutValue] = useState(PAUSE)

	const controlPanel = useMemo(() => (
		<div className="controlpanel">
			{
				keys.map((k, ki) => <Link key={ki} href="#" onClick={() => handleKeyPress({ key: k.key })}>&nbsp;{k.title}&nbsp;</Link>)
			}
		</div>
	), [])

	const nextSlide = useCallback(() => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		)
	}, [images.length])

	const prevSlide = useCallback(() => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		)
	}, [images.length])

	const rotation = useCallback((deg) => {
		setRotate(x => doRotation(x, deg))
	}, [])

	const width = useCallback((w) => {
		if (w === null) {
			setWidthPercent(100)
			return
		}
		setWidthPercent(x => x + w)
	}, [])

	const handleKeyPress = useCallback((event) => {
		if (event.key === SS_FORWARD) {
			nextSlide()
		} else if (event.key === SS_BACK) {
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
			setTimeoutValue(tv => tv === LONG_PAUSE ? PAUSE : LONG_PAUSE)
		}
	}, [nextSlide, prevSlide, rotation])

	useEffect(() => {
		if (style === IMAGE_CLASS_NAMES.length) {
			setStyle(0)
			return
		}

		document.addEventListener('keydown', handleKeyPress)

		let timer = null
		if (timeoutValue > 0) {
			timer = setTimeout(nextSlide, timeoutValue)
		}

		return () => {
			document.removeEventListener('keydown', handleKeyPress)
			if (timer) {
				clearTimeout(timer)
			}
		}
	}, [loaded, style, rotate, timeoutValue, handleKeyPress, nextSlide])

	const imgProps = {
		src: BROWSER_IMAGE_DIR + images[currentIndex] + '?rotate=' + rotate + '&width=' + widthPercent,
		//className: IMAGE_CLASS_NAMES[style],
		//style: {width: '50%'},
		onClick: () => setStyle(s => s + 1),
		alt: `Slide ${currentIndex + 1}`,
		onLoad: (e) => setLoaded(Date.now()) // reset timer
	}

	const statusText = currentIndex + ' / ' + images.length + ' : ' + images[currentIndex] + (rotate > 0 ? ' [' + rotate + 'deg]' : '') + (widthPercent !== 100 ? ` ${widthPercent}%` : '') + (timeoutValue === LONG_PAUSE ? ' [paused]' : '')
	const percentage = parseInt((currentIndex / images.length) * 100)

	return (
		<div>
			<progress value={percentage} max={100} style={{width: '100%'}} />
			{controlPanel}
			<div className="statusouter">
				<div className="statusinner">
					<div className="status">{statusText}</div>
				</div>
			</div>
			<img {...imgProps} />
		</div>

	)
}
