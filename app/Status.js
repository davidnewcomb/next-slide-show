'use client'

import { useCallback, useState } from 'react'

const hidden = {
	display: 'none'
}
const visable = {
}

export default function Status(props) {

	const { statusText, fav } = props
	const [hiddenStyle, setHidden] = useState(visable)

	const style = 'status ' + (fav && 'fav')

	const mouseOverHandler = useCallback(() => {
		setHidden(hidden)
		setTimeout(() => {
			setHidden(visable)
		}, 2000)
	}, [])

	return (
		<div className="statusouter" onMouseOver={mouseOverHandler} style={hiddenStyle}>
			<div className={style}>{statusText}</div>
		</div>
	)
}
