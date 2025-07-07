'use client'

import { useCallback } from "react"

const progressStyle = {
	width: '100%',
	position: 'fixed'
}

export default function ProgressBar(props) {

	const { cur, max, setCurrentIndex } = props

	const onChangeHandler = useCallback((e) => {
		setCurrentIndex(+e.target.value)
	}, [setCurrentIndex])

	return (
		<input type="range" value={cur} min={1} max={max} style={progressStyle} onChange={onChangeHandler}/>
	)
}
