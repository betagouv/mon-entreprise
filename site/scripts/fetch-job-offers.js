// We publish our job offers on https://beta.gouv.fr/recrutement/. To augment
// their reach, we also publish a banner on our website automatically by using
// the beta.gouv.fr API.
import { promisify } from 'util'

import dotenv from 'dotenv'
import { parseString } from 'xml2js'

import { createDataDir, writeInDataDir } from './utils.js'

dotenv.config()

const parseXML = promisify(parseString)

createDataDir()
const jobOffers = await fetchJobOffers()
writeInDataDir('job-offers.json', jobOffers)

async function fetchJobOffers() {
	let jobOffers = []

	try {
		const response = await fetch('https://beta.gouv.fr/nous-rejoindre')
		const content = await response.text()

		// The XML API isn't the most ergonomic, we ought to have a JSON API.
		// cf. https://github.com/betagouv/beta.gouv.fr/issues/6343
		const xml = await parseXML(content)

		jobOffers = xml.feed.entry
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
	} catch (err) {
		console.error('Beta.gouv.fr/jobs error : ')
		console.error(err)
	}

	return jobOffers
}
