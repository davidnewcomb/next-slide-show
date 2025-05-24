'use client'

import { useEffect, useState } from 'react'

const defaultCfg = {
	style: false,
	widthPercent: 100,
	rotate: 0,
	scrollTop: 0,
	scrollLeft: 0
}

export default function LoadPage(props) {
	const { loadObj, close, cfg } = props
	const [dir, setDir] = useState('')
	const [pattern, setPattern] = useState('')
	const [padding, setPadding] = useState(3)
	const [from, setFrom] = useState(1)
	const [to, setTo] = useState(50)

	const saveNew = () => {
		let min = +from
		let max = +to
		if (min > max) {
			const t = max
			max = min
			min = t
		}
		const pad = +padding
		const list = []
		for (let i = min; i <= max; ++i) {
			const f = pattern.replace('%s', String(i).padStart(pad, '0'))
			list.push({ src: f, inc: false, cfg: {...defaultCfg} })
		}
		const cfg = {
			from,
			to,
			padding,
			pattern,
			dir
		}
		loadObj({cfg, list})
		close()
	}

	const saveExisting = (e) => {
		const txt = e.target.value
		const obj = JSON.parse(txt)
		loadObj(obj)
		close()
	}

	useEffect(() => {
		if (!cfg) {
			return cfg
		}
		setDir(cfg.dir)
		setFrom(cfg.from)
		setTo(cfg.to)
		setPadding(cfg.padding)
		setPattern(cfg.pattern)
	}, [cfg])

	return (
		<div>
			<h1>Load</h1>
			<p>Paste into box and click done</p>
			<input type="text" defaultValue="" onChange={saveExisting} />
			<hr />
			<table>
				<tbody>
				<tr>
					<th>Full path to files</th>
					<td><input type="text" value={dir} onChange={(e) => setDir(e.target.value)} /></td>
				</tr>
				<tr>
					<th>File pattern with %s</th>
						<td><input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} /></td>
				</tr>
				<tr>
					<th>From</th>
					<td><input type="text" value={from} onChange={(e) => setFrom(e.target.value)} /></td>
				</tr>
				<tr>
					<th>To</th>
					<td><input type="text" value={to} onChange={(e) => setTo(e.target.value)} /></td>
				</tr>
				<tr>
					<th>Padding</th>
					<td><input type="text" value={padding} onChange={(e) => setPadding(e.target.value)} /></td>
				</tr>
				<tr colSpan="2">
					<td><button onClick={() => close()}>Cancel</button> | <button onClick={() => saveNew()}>Save</button></td>
				</tr>
				</tbody>
			</table>

		</div>
	)
}