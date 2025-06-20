'use client'

import { useCallback, useEffect, useState } from 'react'
import { updateCfgFile } from './server'

export default function SavePage(props) {
	const { data, loadObj, close } = props
	const [saving, setSaving] = useState(false)
	const [buffer, setBuffer] = useState('')
	const [filename, setFilename] = useState('')

	const saveFile = useCallback(() => {
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
	}, [buffer])

	const switchDir = useCallback(() => {
		const obj = JSON.parse(buffer)
		if (obj.admin.filename) {
			const dir = obj.admin.filename.slice(0, obj.admin.filename.lastIndexOf('/') + 1)
			obj.cfg.dir = dir
			loadObj(obj)
			close()
		}
	}, [buffer])

	useEffect(() => {
		const txt = JSON.stringify(data, null, 4)
		setBuffer(txt)
		setFilename(data?.admin?.filename || '')
	}, [data])

	return (
		<form>
		<div class="row">
			<div class="col">
				<h1>Save</h1>
			</div>
			<div class="col">
				<button onClick={() => close()} className="btn btn-warning" >Cancel</button>
			</div>
		</div>

		<hr />

		<div class="row">
			<div class="col">
				<label for="formGroupFilenameInput" className="form-label">File name</label>
				<input value={filename} onChange={(e) => setFilename(e.target.value)} type="text" className="form-control" id="formGroupFilenameInput" placeholder="Config filename" />
			</div>
		</div>

		<div class="row">
			<div class="col">
				<button className="btn btn-primary" onClick={() => switchDir()}>Switch Dir</button> | <button className="btn btn-primary" onClick={() => saveFile()} disabled={saving}>Save file</button>
			</div>
		</div>

		<div class="row">
			<div class="col">
					<textarea value={buffer} onChange={(e) => setBuffer(e.target.value)} className="form-control m-10" />
			</div>
		</div>
		</form>
	)
}