'use client'


export default function TableRow(props) {

	const { idx, url, loaded } = props
	const st = loaded === true ? 'success' : 'warning'

	return (
		<tr className={`table-${st}`}>
			<td>{idx}</td>
			<td>{url}</td>
			<td>{loaded ? 'loaded' : 'waiting...'}</td>
		</tr>
	)
}
