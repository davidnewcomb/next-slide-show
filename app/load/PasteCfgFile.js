'use client'


export default function PasteCfgFile(props) {
	const { loadObj, close } = props

	const pasteExisting = (e) => {
		const txt = e.target.value
		const obj = JSON.parse(txt)
		loadObj(obj)
		close()
	}

	return (
		<table className="w100">
			<tbody>
				<tr>
					<th>Paste into box and click done</th>
					<td><input type="text" defaultValue="" onChange={pasteExisting} /></td>
				</tr>
			</tbody>
		</table>
	)
}
