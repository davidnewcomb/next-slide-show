'use server'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'

const getExtn = (imagePath) => {
	const ee = path.extname(imagePath).slice(1).toLowerCase()
	console.log(`filename=${imagePath} ee=${ee}`)
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
	const rotate = +searchParams.get('rotate') ?? 0
	const width = +searchParams.get('width') ?? 100
	const urlText = searchParams.get('dir') ?? ''
	const url = decodeURI(urlText)

	const { params } = props

	const { img } = params

	if (!img) {
		return response.status(400).json({ error: 'Image name is required' })
	}

	const imagePath = path.join(url, img)

	if (!fs.existsSync(imagePath)) {
		return response.status(404).json({ error: 'Image not found' })
	}

	console.log('Load=' + imagePath)

	let image
	const ct = fileToMimeType(imagePath)

	const cacheFile = `${imagePath}-w${width}-r${rotate}`
	if (fs.existsSync(cacheFile)) {
		console.log('found cache: ' + cacheFile)
		image = fs.readFileSync(cacheFile)
	} else {
		image = fs.readFileSync(imagePath)
		if (rotate > 0 || width !== 100) {
			const lenna = await Jimp.read(image)
			image = await lenna
				.rotate(rotate)
				.scale(width / 100)
				.getBufferAsync(ct)
			console.log(`saving cache: ${cacheFile} [${image.length} bytes]`)
			fs.writeFileSync(cacheFile, image)
			console.log(`saved cache: ${cacheFile} [${image.length} bytes]`)
		}
	}

	return new NextResponse(image, {
		status: 200,
		headers: {
			"Content-Type": ct
		}
	})
}
