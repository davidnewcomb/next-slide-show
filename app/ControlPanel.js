'use client'

import Icon from './Icons'
import {
	SS_PAUSE,
	SS_BACK, SS_FORWARD,
	SS_ROTATE_180, SS_ROTATE_P90, SS_ROTATE_N90,
	SS_WIDTH_SMALLER, SS_WIDTH_BIGGER, SS_WIDTH_MAX,
	SS_SWITCH_TO_FAVS, SS_FAV,
	SS_CFG_DUP, SS_CFG_AUTO_SAVE, SS_CONTROL_PANEL_STYLE
} from './cfg'

const keys = [
	{ key: SS_BACK, icon: 'back', desc: 'Backwards' },
	{ key: SS_FAV, icon: 'fav', desc: 'Add/Remove to favourites' },
	{ key: SS_FORWARD, icon: 'forward', desc: 'Forwards' },
	{ key: SS_PAUSE, icon: 'pause', desc: 'Pause' },
	{ key: SS_WIDTH_SMALLER, icon: 'smaller', desc: 'Decrease size' },
	{ key: SS_WIDTH_MAX, icon: 'normal', desc: 'Normal size' },
	{ key: SS_WIDTH_BIGGER, icon: 'bigger', desc: 'Increase size' },
	{ key: SS_ROTATE_P90, icon: 'rotateleft', desc: 'Rotate anti-clockwise' },
	{ key: SS_ROTATE_N90, icon: 'rotateright', desc: 'Rotate clockwise' },
	{ key: SS_ROTATE_180, icon: 'rotate180', desc: 'Rotate 180' },
	{ key: SS_CFG_DUP, icon: 'duplicate', desc: 'Duplicate' },
	{ key: SS_CFG_AUTO_SAVE, icon: 'save', desc: 'Auto save before each slide change' },
	{ key: SS_CONTROL_PANEL_STYLE, icon: 'panel', desc: 'Horizontal or vertial control panel' },
	{ key: SS_SWITCH_TO_FAVS, icon: 'favs', desc: 'Show favourites' }
]


export default function ControlPanel(props) {
	const { handleKeyPress, fav, controlPanelStyle, autoSave } = props
	// One panel; the horizontal class only turns the whole thing on its side.
	const style = 'controlpanel' + (controlPanelStyle ? ' controlpanel-hor' : '') + (fav ? ' fav' : '')

	const stateOf = (k) => {
		if (k.key !== SS_CFG_AUTO_SAVE) {
			return { off: false, suffix: '' }
		}
		return { off: !autoSave, suffix: autoSave ? ' [on]' : ' [off]' }
	}

	return (
		<div className={style}>
			{
				keys.map((k, ki) => {
					const { off, suffix } = stateOf(k)
					return (
						<div className={'controlpanelhov' + (suffix && !off ? ' controlpanelactive' : '')} key={ki} onClick={() => handleKeyPress({ key: k.key })} title={`${k.desc}${suffix} (${k.key})`}>
							<Icon name={k.icon} off={off} />
						</div>
					)
				})
			}
		</div>
	)
}
