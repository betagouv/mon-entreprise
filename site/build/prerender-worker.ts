import { promises as fs, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import { render } from '../dist/ssr/entry-server.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const cache: { [k: string]: string } = {}

const htmlBodyStart = '<!--app-html:start-->'
const htmlBodyEnd = '<!--app-html:end-->'
const headTagsStart = '<!--app-helmet-tags:start-->'
const headTagsEnd = '<!--app-helmet-tags:end-->'

const regexHTML = new RegExp(htmlBodyStart + '[\\s\\S]+' + htmlBodyEnd, 'm')
const regexHelmet = new RegExp(headTagsStart + '[\\s\\S]+' + headTagsEnd, 'm')

interface Params {
	site: string
	url: string
	lang: string
}

export default async ({ site, url, lang }: Params) => {
	const template =
		cache[site] ??
		readFileSync(path.join(dirname, `../dist/${site}.html`), 'utf-8')

	cache[site] ??= template

	// TODO: Add CI test to enforce meta tags on SSR pages
	const { html, styleTags, helmet } = (await render(url, lang)) as {
		html: string
		styleTags: string
		helmet?: { title: string; meta: string }
	}

	const page = template
		.replace(regexHTML, html.trim())
		.replace('<!--app-style-->', styleTags)
		.replace(
			regexHelmet,
			(helmet?.title.toString() ?? '') + (helmet?.meta.toString() ?? '')
		)

	const dir = path.join(dirname, '../dist/prerender', site, decodeURI(url))

	await fs.mkdir(dir, { recursive: true })
	await fs.writeFile(path.join(dir, 'index.html'), page)

	return path.relative(
		path.join(dirname, '../dist'),
		path.join(dir, 'index.html')
	)
}
