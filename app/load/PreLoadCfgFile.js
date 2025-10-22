'use client'

import { useCallback, useEffect, useState } from 'react'
import { readCfgFile } from '../server'
import { useSearchParams } from 'next/navigation'
import TableRow from './TableRow'
import ScreenShow from './ScreenShow'



const formatForPreLoad = (obj) => {
	const { cfg, list } = obj
	const { dir } = cfg
	const items = list.map((it, idx) => {

		const { src, cfg } = it
		const { rotate, widthPercent } = cfg

		let url = `/api/img/${src}?dir=${dir}`
		let qs = []
		if (rotate !== 0) {
			qs.push('rotate=' + rotate)
		}
		if (widthPercent) {
			qs.push('width=' + widthPercent)
		} else {
			qs.push('width=100')
		}

		if (qs.length > 0) {
			url += '&' + qs.join('&')
		}

		return { loaded: false, url: url, idx: idx }
	})

	return items
}

export default function PreLoadCfgFile(props) {
	const { filename } = props
	const [newFilename, setNewFilename] = useState('')
	const [message, setMessage] = useState('')
	const searchParams = useSearchParams()
	const [items, setItems] = useState([])

	const loadExisting = useCallback(() => {
		console.log('loadExisting:filename=', newFilename)
		readCfgFile(newFilename)
			.then((obj) => {
				if (obj.error) {
					setMessage(obj.message)
					return
				}
				console.log('===========')
				console.log('loadExisting=', obj)

				const items = formatForPreLoad(obj)
				console.log('items', items)
				console.log('===========')

				setItems(items)
			})
			.catch((err) => {
				console.log('ERROR: loadExisting=', err)
				setMessage(err.toString())
			})
	}, [newFilename])

	const onChangeHandler = useCallback((e) => {
		setNewFilename(e.target.value)
	}, [])

	const finishImageLoad = useCallback((idx) => {
		if (items.length === 0) {
			return
		}

		console.log(`finishImageLoad idx=${idx}`)

		//		setTimeout(() => {
		const newItems = [...items]
		newItems[idx].loaded = true
		setItems(newItems)
		//		}, 1000)

	}, [items])

	useEffect(() => {
		if (searchParams.get('cfgfile')) {
			setNewFilename(searchParams.get('cfgfile'))
		} else {
			setNewFilename(filename)
		}
	}, [filename, searchParams])

	return (
		<div className="container">
			<ScreenShow items={items} finishImageLoad={finishImageLoad} />
			<table className="table">
				<tbody>
					<tr>
						<th>Index</th>
						<td><input type="text" value={newFilename} onChange={onChangeHandler} className="form-control" /></td>
						<td><button onClick={loadExisting} className="btn btn-primary">Load</button></td>
					</tr>
					<tr>
						<td colSpan={3}><div className="errortext">{message}</div></td>
					</tr>

					{items.map(it => <TableRow key={it.idx} idx={it.idx} url={it.url} loaded={it.loaded} />)}
				</tbody>
			</table>
		</div>
	)
}
