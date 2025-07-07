'use server'

import fs from 'fs'
import path from 'path'
import { SERVER_IMAGE_DIR } from './cfg'

// 1 - start (no admin)
// 2 - add admin section
// 3 - change cfg.scrollTop,cfg.scrollTop to cfg.scroll = {t,l}, add VERSION

const VERSION_1 = 1
const VERSION_2 = 2
const VERSION_3 = 3
const VERSION = VERSION_3

export const getImages = async (folder) => {
	const images = fs.readdirSync(SERVER_IMAGE_DIR).filter(f => f.toLowerCase().endsWith('.jpg'))
	images.sort()
	return images
}

const imageExtns = ['.jpg', '.jpeg', '.webp']

const generateCfgJson = (cfgFilename) => {
	const dir = path.dirname(cfgFilename)
	// const images = fs.readdirSync(SERVER_IMAGE_DIR).filter(f => f.toLowerCase().endsWith('.jpg'))
	const images = fs.readdirSync(dir).filter(f => imageExtns.some((i) => f.toLowerCase().endsWith(i)))
	images.sort()

	const listItem = {
		src: '',
		inc: false,
		cfg: {
			style: false,
			widthPercent: 100,
			rotate: 0,
			scroll: {
				t: 0,
				l: 0
			}
		}
	}

	const now = new Date()

	const obj = {
		cfg: {
			from: images.length,
			to: 1,
			padding: 0,
			pattern: '',
			dir: dir
		},
		list: [],
		admin: {
			version: VERSION,
			updated: now,
			created: now,
			filename: cfgFilename
		}
	}
	images.forEach(image => {
		obj.list.push({ ...listItem, src: image })
	})
	return obj

}

export const readCfgFile = (filename) => {
	if (!fs.existsSync(filename)) {
		return {error: true, message: filename + ' not found'}
	}
	if (fs.statSync(filename).size == 0) {
		const o = generateCfgJson(filename)
		return o
//		return { error: true, message: filename + ' is empty' }
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
	if (!obj.admin.version) {
		obj.admin.version = VERSION_2
	}

	if (obj.admin.version < VERSION_3 && obj.list.length > 0) {
		for (let i = 0 ; i < obj.list.length ; ++i) {
			obj.list[i].cfg.scroll = {
				t: obj.list[i].cfg.scrollTop,
				l: obj.list[i].cfg.scrollLeft
			}
			delete obj.list[i].cfg.scrollTop
			delete obj.list[i].cfg.scrollLeft
		}
		obj.admin.version = VERSION_3
	}
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