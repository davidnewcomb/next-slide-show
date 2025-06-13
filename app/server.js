'use server'

import fs from 'fs'
import { SERVER_IMAGE_DIR } from './cfg'

export const getImages = async (folder) => {
	const images = fs.readdirSync(SERVER_IMAGE_DIR).filter(f => f.toLowerCase().endsWith('.jpg'))
	images.sort()
	return images
}

export const readCfgFile = async (filename) => {
	const json = fs.readFileSync(filename)
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