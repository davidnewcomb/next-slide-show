'use client'

import { useState } from 'react'

export default function SavePage(props) {
	const { data, close } = props
	const [tick, setTick] = useState(false)
	const text = tick ? JSON.stringify(data, null, 4) : JSON.stringify(data)

	return (
		<div>
			<h1>Save</h1>
			<input type="checkbox" value="true" checked={tick} onChange={() => setTick(s => !s)}/> Pretty<br/>
			<button onClick={() => close()}>Done</button>
			<hr/>
			<pre>{text}</pre>
		</div>
	)
}