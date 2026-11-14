'use client'

// Stroke based icons, all drawn on the same 24x24 grid so that every
// control panel button ends up exactly the same size.

const paths = {
	back: <polyline points="15 4 7 12 15 20" />,
	forward: <polyline points="9 4 17 12 9 20" />,
	pause: <>
		<rect x="7" y="5" width="3.5" height="14" rx="1" />
		<rect x="13.5" y="5" width="3.5" height="14" rx="1" />
	</>,
	fav: <path d="M12 20.5S4 15.8 4 10.2A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 8 2.2c0 5.6-8 10.3-8 10.3z" />,
	favs: <polygon points="12 3 14.9 9.2 21.5 10.1 16.7 14.8 17.9 21.3 12 18.1 6.1 21.3 7.3 14.8 2.5 10.1 9.1 9.2" />,
	smaller: <>
		<circle cx="10.5" cy="10.5" r="6.5" />
		<line x1="15.5" y1="15.5" x2="21" y2="21" />
		<line x1="7.5" y1="10.5" x2="13.5" y2="10.5" />
	</>,
	bigger: <>
		<circle cx="10.5" cy="10.5" r="6.5" />
		<line x1="15.5" y1="15.5" x2="21" y2="21" />
		<line x1="7.5" y1="10.5" x2="13.5" y2="10.5" />
		<line x1="10.5" y1="7.5" x2="10.5" y2="13.5" />
	</>,
	normal: <>
		<rect x="3" y="6" width="18" height="12" rx="1" />
		<line x1="7" y1="12" x2="17" y2="12" />
		<polyline points="9.5 9.5 7 12 9.5 14.5" />
		<polyline points="14.5 9.5 17 12 14.5 14.5" />
	</>,
	rotateleft: <>
		<polyline points="2 4 2 10 8 10" />
		<path d="M4.6 15a8.5 8.5 0 1 0 1.9-8.8L2 10" />
	</>,
	rotateright: <>
		<polyline points="22 4 22 10 16 10" />
		<path d="M19.4 15a8.5 8.5 0 1 1-1.9-8.8L22 10" />
	</>,
	rotate180: <>
		<path d="M12 3.5a8.5 8.5 0 0 1 0 17" />
		<polyline points="9.5 6 12 3.5 14.5 6" />
		<polyline points="14.5 18 12 20.5 9.5 18" />
	</>,
	duplicate: <>
		<rect x="9" y="9" width="12" height="12" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
	</>,
	panel: <>
		<rect x="3" y="3" width="18" height="18" rx="2" />
		<line x1="9" y1="3" x2="9" y2="21" />
	</>,
	save: <>
		<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
		<polyline points="17 21 17 13 7 13 7 21" />
		<polyline points="7 3 7 8 15 8" />
	</>
}

export default function Icon(props) {
	const { name, off } = props
	const icon = paths[name]

	if (!icon) {
		return null
	}

	return (
		<svg className="controlpanelicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			{icon}
			{off && <line className="controlpaneloff" x1="3.5" y1="20.5" x2="20.5" y2="3.5" />}
		</svg>
	)
}
