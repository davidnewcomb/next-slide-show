'use server'

import fs from 'fs'
import { SERVER_IMAGE_DIR } from './cfg'

export const getImages = async (folder) => {
	const images = fs.readdirSync(SERVER_IMAGE_DIR).filter(f => f.toLowerCase().endsWith('.jpg'))
	images.sort()
	return images
}
