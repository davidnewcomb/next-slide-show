'use server'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const getExtn = (imagePath) => {
	const ee = path.extname(imagePath).slice(1).toLowerCase()
	if (ee === 'jpg') {
		return 'jpeg'
	}
	return ee
}

const fileToMimeType = (imagePath) => {
	return 'image/' + getExtn(imagePath)
}

// Images are always served untouched. Rotation and scaling are applied in the
// browser with css, so there is nothing to generate and nothing to cache here.
// Any rotate/width query parameters left over in old links are ignored.
export async function GET(request, props) {
	const { searchParams } = new URL(request.url)
	const urlText = searchParams.get('dir') ?? ''
	const url = decodeURI(urlText)

	const { img } = props.params

	if (!img) {
		return NextResponse.json({ error: 'Image name is required' }, { status: 400 })
	}

	const imagePath = path.join(url, img)

	if (!fs.existsSync(imagePath)) {
		const m = 'Image not found: ' + imagePath
		console.log(m)
		return NextResponse.json({ error: m }, { status: 404 })
	}

	console.log('Load=' + imagePath)

	const image = fs.readFileSync(imagePath)

	return new NextResponse(image, {
		status: 200,
		headers: {
			'Content-Type': fileToMimeType(imagePath),
			// the same original is now re-requested for every transformation,
			// so let the browser hold on to it
			'Cache-Control': 'private, max-age=3600'
		}
	})
}
