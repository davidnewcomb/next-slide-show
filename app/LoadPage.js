'use client'

import LoadCfgFile from './load/LoadCfgFile'
import PasteCfgFile from './load/PasteCfgFile'
import GenerateCfgFile from './load/GenerateCfgFile'
import PreLoadCfgFile from './load/PreLoadCfgFile'


export default function LoadPage(props) {
	const { loadObj, close, cfg, admin } = props

	return (
		<div className="container">
			<h1>Load</h1>
			<button onClick={() => close()}>Cancel</button>
			<hr/>
			<LoadCfgFile loadObj={loadObj} close={close} filename={admin?.filename || ''} />
			<hr/>
			<PasteCfgFile loadObj={loadObj} close={close} />
			<hr />
			<GenerateCfgFile loadObj={loadObj} close={close} cfg={cfg} admin={admin} />
			<hr/>
			<PreLoadCfgFile />
		</div>
	)
}
