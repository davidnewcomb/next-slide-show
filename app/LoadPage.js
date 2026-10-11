'use client'

import LoadCfgFile from './load/LoadCfgFile'
import PasteCfgFile from './load/PasteCfgFile'
import GenerateCfgFile from './load/GenerateCfgFile'
import PreLoadCfgFile from './load/PreLoadCfgFile'
import { Suspense, useEffect } from 'react'


export default function LoadPage(props) {
	const { loadObj, close, cfg, admin, scrollHandlerController } = props

	useEffect(() => {
		scrollHandlerController(false)
		return () => scrollHandlerController(true)
	}, [])

	return (
		<div className="container">
			<h1>Load</h1>
			<button onClick={() => close()}>Cancel</button>
			<hr />
			<Suspense fallback={null}>
				<LoadCfgFile loadObj={loadObj} close={close} filename={admin?.filename || ''} />
			</Suspense>
			<hr />
			<PasteCfgFile loadObj={loadObj} close={close} />
			<hr />
			<GenerateCfgFile loadObj={loadObj} close={close} cfg={cfg} admin={admin} />
			<hr />
			<Suspense fallback={null}>
				<PreLoadCfgFile />
			</Suspense>
		</div>
	)
}
