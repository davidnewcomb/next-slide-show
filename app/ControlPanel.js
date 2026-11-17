'use client'

import { useCallback, useRef, useState } from 'react'
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

// How much of the panel has to stay on screen so that it can always be
// dragged back again.
const KEEP_VISIBLE = 30

const clamp = (v, lo, hi) => v < lo ? lo : (v > hi ? hi : v)

export default function ControlPanel(props) {
	const { handleKeyPress, fav, controlPanelStyle, autoSave } = props
	// One panel; the horizontal class only turns the whole thing on its side.
	const style = 'controlpanel' + (controlPanelStyle ? ' controlpanel-hor' : '') + (fav ? ' fav' : '')

	// The drag is an offset from wherever the stylesheet put the panel. It is
	// applied with the `translate` property, which composes before the `rotate`
	// of the horizontal panel, so a drag moves the panel the way the mouse
	// went whichever way round the panel is.
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [dragging, setDragging] = useState(false)
	const panel = useRef(null)
	const drag = useRef(null)

	const stateOf = (k) => {
		if (k.key !== SS_CFG_AUTO_SAVE) {
			return { off: false, suffix: '' }
		}
		return { off: !autoSave, suffix: autoSave ? ' [on]' : ' [off]' }
	}

	const onPointerDown = useCallback((e) => {
		// Visual box - with the rotation already baked in - so the limits are
		// what you can actually see.
		const r = panel.current.getBoundingClientRect()
		drag.current = {
			id: e.pointerId,
			px: e.clientX,
			py: e.clientY,
			ox: offset.x,
			oy: offset.y,
			minX: offset.x + KEEP_VISIBLE - r.right,
			maxX: offset.x + window.innerWidth - KEEP_VISIBLE - r.left,
			minY: offset.y + KEEP_VISIBLE - r.bottom,
			maxY: offset.y + window.innerHeight - KEEP_VISIBLE - r.top
		}
		e.currentTarget.setPointerCapture(e.pointerId)
		setDragging(true)
		e.preventDefault()
	}, [offset])

	const onPointerMove = useCallback((e) => {
		const d = drag.current
		if (!d || d.id !== e.pointerId) {
			return
		}
		setOffset({
			x: clamp(d.ox + e.clientX - d.px, d.minX, d.maxX),
			y: clamp(d.oy + e.clientY - d.py, d.minY, d.maxY)
		})
	}, [])

	const onPointerUp = useCallback((e) => {
		if (drag.current && drag.current.id === e.pointerId) {
			drag.current = null
			setDragging(false)
		}
	}, [])

	return (
		<div ref={panel} className={style} style={{ translate: `${offset.x}px ${offset.y}px` }}>
			<div
				className={'controlpaneltape' + (dragging ? ' controlpaneltapedrag' : '')}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				onDoubleClick={() => setOffset({ x: 0, y: 0 })}
				title="Drag to move the control panel (double click to put it back)"
			/>
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
