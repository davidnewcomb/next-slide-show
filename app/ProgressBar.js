//'use client'

const progressStyle = { width: '100%' }

export default function ProgressBar(props) {

	const { percentage } = props

	return (
		<progress value={percentage} max={100} style={progressStyle} />
	)
}
