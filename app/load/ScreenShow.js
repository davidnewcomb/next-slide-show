'use client'


export default function ScreenShow(props) {

	const { items, finishImageLoad } = props

	if (items.length === 0) {
		return <div>No items</div>
	}

	const images = items.filter(it => it.loaded !== true).filter((_, idx) => idx < 3)

	return (
		<div className="row">
			{images.map(item => (
				<div key={item.idx} className="col" style={{ border: '1px black solid' }}>
					<img src={item.url} onLoad={() => finishImageLoad(item.idx)} className="img-fluid" />
				</div>
			))}
		</div>
	)
}
