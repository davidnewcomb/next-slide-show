//'use client'

export default function Status(props) {

	const { statusText } = props

	return (
		<div className="statusouter">
			<div className="status">{statusText}</div>
		</div>
	)
}
