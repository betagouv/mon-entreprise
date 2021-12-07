// We publish our job offers on https://beta.gouv.fr/recrutement/. To augment
// their reach, we also publish a banner on our website automatically by using
// the beta.gouv.fr API.

import 'isomorphic-fetch'
import { parseString } from 'xml2js'
import { promisify } from 'util'
import { createDataDir, writeInDataDir } from './utils.js'

const parseXML = promisify(parseString)

main()

async function main() {
	createDataDir()
	const jobOffers = await fetchJobOffers()
	writeInDataDir('job-offers.json', jobOffers)
}

async function fetchJobOffers() {
	const response = await fetch('https://beta.gouv.fr/jobs.xml')
	const content = await response.text()
	// The XML API isn't the most ergonomic, we ought to have a JSON API.
	// cf. https://github.com/betagouv/beta.gouv.fr/issues/6343
	const jobOffers = (await parseXML(content)).feed.entry
		.map((entry) => ({
			title: entry.title[0]['_'].trim(),
			link: entry.link[0].$.href,
			content: entry.content[0]['_'].trim(),
		}))
		.filter(({ title }) => title.includes('Offre de Mon-entreprise'))
		.map(({ title, ...rest }) => ({
			...rest,
			title: title.replace(' - Offre de Mon-entreprise', ''),
		}))

	return jobOffers
}
