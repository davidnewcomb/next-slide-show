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
			loadObj(d, false)
			close()
		})
	}, [buffer, filename])

	const switchDir = useCallback(() => {
		const obj = JSON.parse(buffer)
		if (obj.admin.filename) {
			const dir = obj.admin.filename.slice(0, obj.admin.filename.lastIndexOf('/') + 1)
			obj.cfg.dir = dir
			const str = JSON.stringify(obj, null, 4)
			console.log('switch dir=' + dir)
			setBuffer(str)
		}
	}, [buffer])

	const updateRotate = useCallback((deg) => {
		const obj = JSON.parse(buffer)
		for (let i = 0; i < obj.list.length; ++i) {
			obj.list[i].cfg.rotate = deg
		}
		const str = JSON.stringify(obj, null, 4)
		console.log('set all rotate=' + deg)
		setBuffer(str)
	}, [buffer])

	const updateStyle = useCallback((none) => {
		const obj = JSON.parse(buffer)
		for (let i = 0; i < obj.list.length; ++i) {
			obj.list[i].cfg.style = none
		}
		const str = JSON.stringify(obj, null, 4)
		//console.log('style=' + none + ' ' + str)
		console.log('set all style=' + none)
		setBuffer(str)
	}, [buffer])

	const proxySetFilename = useCallback((e) => {
		setFilename(e.target.value)
	}, [])

	useEffect(() => {
		const txt = JSON.stringify(data, null, 4)
		setBuffer(txt)
		setFilename(data?.admin?.filename || '')
	}, [data])

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h1>Save</h1>
				</div>
			</div>

			<hr />

			<div className="row">
				<div className="col">
					<label htmlFor="formGroupFilenameInput" className="form-label">File name</label>
					<input value={filename} onChange={proxySetFilename} type="text" className="form-control" id="formGroupFilenameInput" placeholder="Config filename" />
				</div>
			</div>

			<div className="row">
				<div className="col">
					<button className="btn btn-primary" onClick={switchDir}>Switch Dir</button>
					&nbsp;||&nbsp;
					Rotate
					&nbsp;
					<button className="btn btn-primary" onClick={() => updateRotate(0)}>0</button>
					&nbsp;
					<button className="btn btn-primary" onClick={() => updateRotate(90)}>90</button>
					&nbsp;
					<button className="btn btn-primary" onClick={() => updateRotate(180)}>180</button>
					&nbsp;
					<button className="btn btn-primary" onClick={() => updateRotate(270)}>270</button>
					&nbsp;||&nbsp;
					<button className="btn btn-primary" onClick={() => updateStyle(true)}>Style=none</button>
					&nbsp;
					<button className="btn btn-primary" onClick={() => updateStyle(false)}>Style=width fit</button>
				</div>
			</div>

			<div className="row">
				<div className="col">
					<textarea value={buffer} onChange={(e) => setBuffer(e.target.value)} rows="10" className="form-control m-10" />
				</div>
			</div>
			<div className="row">
				<div className="col">
					<button onClick={close} className="btn btn-warning">Cancel</button>
					<button className="btn btn-primary" onClick={saveFile} disabled={saving}>Save file</button>
				</div>
			</div>

		</div>
	)
}