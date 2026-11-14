'use server'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const getExtn = (imagePath) => {
	const ee = path.extname(imagePath).slice(1).toLowerCase()
	console.log(`filename=${imagePath} extension=${ee}`)
	if (ee === 'jpg') {
		return 'jpeg'
	}
	return ee
}

const fileToMimeType = (imagePath) => {
	const ee = getExtn(imagePath)
	return 'image/' + ee
}

export async function GET(request, props, response) {
	const { searchParams } = new URL(request.url)
	const urlText = searchParams.get('dir') ?? ''
	const url = decodeURI(urlText)

	const { params } = props

	const { img } = params

	if (!img) {
		return response.status(400).json({ error: 'Image name is required' })
	}

	const imagePath = path.join(url, img)

	if (!fs.existsSync(imagePath)) {
		const m = 'Image not found: ' + imagePath
		console.log(m)
		return response.status(404).json({ error: m })
	}

	console.log('Load=' + imagePath)

	const ct = fileToMimeType(imagePath)

	// The image is served exactly as it is on disk. Rotation and scaling are
	// done in the browser.
	const image = fs.readFileSync(imagePath)

	return new NextResponse(image, {
		status: 200,
		headers: {
			"Content-Type": ct
		}
	})
}
