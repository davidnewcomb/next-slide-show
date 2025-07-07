'use client'

const sStyle = 'statusouter '

export default function Status(props) {

	const { statusText, fav } = props

	const style = sStyle + (fav && 'fav')

	return (
		<div className={style}>
			<div className="status">{statusText}</div>
		</div>
	)
}
