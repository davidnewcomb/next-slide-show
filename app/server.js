'use server'

import fs from 'fs'
import { SERVER_IMAGE_DIR } from './cfg'

export const getImages = async (folder) => {
	const images = fs.readdirSync(SERVER_IMAGE_DIR).filter(f => f.toLowerCase().endsWith('.jpg'))
	images.sort()
	return images
}

export const readCfgFile = (filename) => {
	if (!fs.existsSync(filename)) {
		return {error: true, message: filename + ' not found'}
	}
	if (fs.statSync(filename).size == 0) {
		return { error: true, message: filename + ' is empty' }
	}
	const json = fs.readFileSync(filename)
	console.log('Read file:' + filename)
	console.log(json.toString())
	console.log('---')

	const obj = JSON.parse(json)
	if (!obj.admin) {
		obj.admin = {}
	}
	obj.admin.filename = filename
	return obj
}

export const updateCfgFile = async (filename, obj) => {
	if (!obj.admin) {
		obj.admin = {}
	}
	obj.admin.updated = new Date()
	obj.admin.filename = filename
	const json = JSON.stringify(obj, null, 4)
	fs.writeFileSync(filename, json)
	return obj
}