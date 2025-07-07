'use client'

import { useEffect, useState } from 'react'


export default function PasteCfgFile(props) {
	const { loadObj, close } = props
	const [buffer, setBuffer] = useState('')

	useEffect(() => {
		if (buffer !== '') {
			console.log('useEffect:buffer:something')
			const obj = JSON.parse(buffer)
			loadObj(obj)
			close()
		} else {
			console.log('useEffect:buffer:""')
		}
	}, [buffer])

	return (
		<table className="w100">
			<tbody>
				<tr>
					<th>Paste into box and click done</th>
					<td><input type="text" value={buffer} onChange={(e) => setBuffer(e.target.value)} /></td>
				</tr>
			</tbody>
		</table>
	)
}
