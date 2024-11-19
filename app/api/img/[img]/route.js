'use server'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { SERVER_IMAGE_DIR } from '/app/cfg'
import Jimp from 'jimp'

const fileToMimeType = (imagePath) => {
	const ee = path.extname(imagePath).slice(1).toLowerCase()
	console.log(`filename=${imagePath} ee=${ee}`)
	if (ee === 'jpg') {
		return 'image/jpeg'
	}
	return 'image/' + ee
}

export async function GET(request, props, response) {
	const { searchParams } = new URL(request.url)
	const rotate = +searchParams.get('rotate') ?? 0
	const width = +searchParams.get('width') ?? 100

	const {params } = props

	const {img} = params

	if (!img) {
		return response.status(400).json({ error: 'Image name is required' })
	}

	const imagePath = path.join(SERVER_IMAGE_DIR, img)

	if (!fs.existsSync(imagePath)) {
		return response.status(404).json({ error: 'Image not found' })
	}

	console.log('Load=' + imagePath)

	let image = fs.readFileSync(imagePath)
	const ct = fileToMimeType(imagePath)

	if (rotate > 0 || width !== 100) {
		const lenna = await Jimp.read(image)
		image = await lenna
				.rotate(rotate)
				.scale(width/100)
				.getBufferAsync(ct)
	}

	return new NextResponse(image, {
		status: 200,
		headers: {
			"Content-Type": ct
		}
	})
}
