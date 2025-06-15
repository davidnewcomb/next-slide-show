'use client'

import { useState, useEffect } from 'react'

const defaultCfg = {
	style: false,
	widthPercent: 100,
	rotate: 0,
	scrollTop: 0,
	scrollLeft: 0
}

export default function GenerateCfgFile(props) {
	const { loadObj, close, cfg, admin } = props

	const [dir, setDir] = useState('')
	const [pattern, setPattern] = useState('')
	const [padding, setPadding] = useState(3)
	const [from, setFrom] = useState(1)
	const [to, setTo] = useState(50)

	const loadNew = () => {
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
		loadObj({cfg, list, admin})
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
			<table className="w100">
				<tbody>
					<tr>
						<th>Cfg file name</th>
						<td>{admin?.filename}</td>
					</tr>
					<tr>
						<th>Cfg file updated</th>
						<td>{admin?.updated && admin.updated.toString()}</td>
					</tr>
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
						<td><button onClick={() => loadNew()}>Load</button></td>
					</tr>
				</tbody>
			</table>

	)
}
