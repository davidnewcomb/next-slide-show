'use client'

import { useEffect, useState } from 'react'
import { updateCfgFile } from './server'

export default function SavePage(props) {
	const { data, loadObj, close } = props
	const [saving, setSaving] = useState(false)
	const [buffer, setBuffer] = useState('')

	const saveFile = async () => {
		setSaving(true)
		const obj = JSON.parse(buffer)

		updateCfgFile(data.admin.filename, obj).then((d) => {
			setSaving(false)
			loadObj(d)
			close()
		})
	}

	useEffect(() => {
		const txt = JSON.stringify(data, null, 4)
		setBuffer(txt)
	}, [data])

	return (
		<div>
			<h1>Save</h1>
			<button onClick={() => close()}>Close</button>
			<hr />
			<div style={{ width: '100%' }}>File name: <input defaultValue={data?.admin?.filename} style={{ width: '100%' }} /></div>
			<div>File updated: {data?.admin?.updated}</div>
			<button onClick={() => saveFile()} disabled={saving}>Save file</button>
			<textarea value={buffer} style={{ width: '100%' }} onChange={(e) => setBuffer(e.target.value)}/>
		</div>
	)
}