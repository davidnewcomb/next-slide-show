'use client'

import { useEffect, useState } from 'react'
import { updateCfgFile } from './server'

export default function SavePage(props) {
	const { data, loadObj, close } = props
	const [saving, setSaving] = useState(false)
	const [buffer, setBuffer] = useState('')
	const [filename, setFilename] = useState('')

	const saveFile = () => {
		setSaving(true)
		const obj = JSON.parse(buffer)

		if (!obj.admin) {
			obj.admin = {}
		}
		obj.admin = { ...obj.admin, updated: new Date(), filename }

		updateCfgFile(filename, obj).then((d) => {
			setSaving(false)
			loadObj(d)
			close()
		})
	}

	useEffect(() => {
		const txt = JSON.stringify(data, null, 4)
		setBuffer(txt)
		setFilename(data?.admin?.filename || '')
	}, [data])

	return (
		<div>
			<h1>Save</h1>
			<button onClick={() => close()}>Cancel</button>
			<hr />
			<div style={{ width: '100%' }}>File name: <input value={filename} onChange={(e) => setFilename(e.target.value)} style={{ width: '100%' }} /></div>
			<div>File updated: {data?.admin?.updated && data.admin.updated.toString()}</div>
			<button onClick={() => saveFile()} disabled={saving}>Save file</button>
			<textarea value={buffer} style={{ width: '100%' }} onChange={(e) => setBuffer(e.target.value)}/>
		</div>
	)
}