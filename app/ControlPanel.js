'use client'

import {
	SS_PAUSE,
	SS_BACK, SS_FORWARD,
	SS_ROTATE_180, SS_ROTATE_P90, SS_ROTATE_N90,
	SS_WIDTH_SMALLER, SS_WIDTH_BIGGER, SS_WIDTH_MAX,
	SS_SWITCH_TO_FAVS, SS_FAV
} from './cfg'

const keys = [
	{ key: SS_BACK, title: '<', desc: 'Backwards' },
	{ key: SS_FORWARD, title: '>', desc: 'Forwards' },
	{ key: SS_PAUSE, title: 'P', desc: 'Pause' },
	{ key: SS_WIDTH_SMALLER, title: 'v', desc: 'Decrease size' },
	{ key: SS_WIDTH_MAX, title: '-', desc: 'Normal size' },
	{ key: SS_WIDTH_BIGGER, title: '^', desc: 'Increase size' },
	{ key: SS_ROTATE_P90, title: '-90', desc: 'Rotate anti-clockwise' },
	{ key: SS_ROTATE_N90, title: '+90', desc: 'Rotate clockwise' },
	{ key: SS_ROTATE_180, title: '180', desc: 'Rotate 180' },
	{ key: SS_FAV, title: '+Fav', desc: 'Add/Remove to favourites' },
	{ key: SS_SWITCH_TO_FAVS, title: 'Fav', desc: 'Show favourites' }
]

export default function ControlPanel(props) {
	const { handleKeyPress } = props

	return (
		<div className="controlpanel">
			{
				keys.map((k, ki) => <div key={ki} onClick={() => handleKeyPress({ key: k.key })} title={`${k.desc} (${k.key})`}>&nbsp;{k.title}&nbsp;</div>)
			}
		</div>
	)
}
