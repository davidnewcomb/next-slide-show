'use client'

import { useCallback, useEffect, useState } from 'react'
import { readCfgFile } from '../server'
import { useSearchParams } from 'next/navigation'

export default function LoadCfgFile(props) {
	const { loadObj, close, filename } = props
	const [newFilename, setNewFilename] = useState('')
	const [message, setMessage] = useState('')
	const searchParams = useSearchParams()

	const loadExisting = () => {
		console.log('loadExisting:filename=', newFilename)
		readCfgFile(newFilename)
			.then((obj) => {
				if (obj.error) {
					setMessage(obj.message)
					return
				}
				console.log('loadExisting=', obj)
				loadObj(obj)
				close()
			})
			.catch((err) => {
				console.log('ERROR: loadExisting=', err)
			})
	}

	const onChangeHandler = useCallback((e) => {
		setNewFilename(e.target.value)
	}, [])

	useEffect(() => {
		if (searchParams.get('cfgfile')) {
			setNewFilename(searchParams.get('cfgfile'))
		} else {
			setNewFilename(filename)
		}
	}, [filename, searchParams])

	return (
		<table className="w100">
			<tbody>
				<tr>
					<th>Cfg file</th>
					<td><input type="text" value={newFilename} onChange={onChangeHandler} className="w100"/></td>
					<td><button onClick={loadExisting}>Load</button></td>
				</tr>
				<tr>
					<td colSpan={3}><div className="errortext">{message}</div></td>
				</tr>
			</tbody>
		</table>
	)
}
