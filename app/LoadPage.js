'use client'

import LoadCfgFile from './load/LoadCfgFile'
import PasteCfgFile from './load/PasteCfgFile'
import PreLoadCfgFile from './load/PreLoadCfgFile'
import { useEffect } from 'react'


export default function LoadPage(props) {
	const { loadObj, close, admin, scrollHandlerController } = props

	useEffect(() => {
		scrollHandlerController(false)
		return () => scrollHandlerController(true)
	}, [])

	return (
		<div className="container">
			<h1>Load</h1>
			<button onClick={() => close()}>Cancel</button>
			<hr />
			<LoadCfgFile loadObj={loadObj} close={close} filename={admin?.filename || ''} />
			<hr />
			<PasteCfgFile loadObj={loadObj} close={close} />
			<hr />
			<PreLoadCfgFile />
		</div>
	)
}
