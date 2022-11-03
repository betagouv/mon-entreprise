/* eslint-disable no-console */
import 'isomorphic-fetch'

import { exec } from 'child_process'
import { promisify } from 'util'

// Extrait la liste des liens référencés dans la base de code
const { stdout, stderr } = await promisify(exec)(
	"rg -oNI -e 'https?://([\\w/_\\-?=%+@]|\\.\\w)+' -g '*.{yaml,ts,tsx,js,jsx}' -g '!*-en.yaml' ./ | sort | uniq"
)
if (stderr) {
	throw new Error(stderr)
}

const links = stdout
	.split('\n')
	.filter(Boolean)
	.filter((link) => !link.startsWith('http://localhost'))

// Certains sites référencés ont des problèmes de certificats, mais ce n'est pas
// ce que nous cherchons à détecter ici.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// Création d'une queue permettant de paralléliser la vérification des liens
const queue = [...links]
const detectedErrors = []
const simultaneousItems = 5

async function processNextQueueItem() {
	if (queue.length !== 0) {
		await fetchAndReport(queue.shift())
		await processNextQueueItem()
	}
}

async function fetchAndReport(link) {
	let status = await getHTTPStatus(link)

	// Retries in case of timeout
	let remainingRetries = 3
	while (status === 499 && remainingRetries > 0) {
		remainingRetries--
		await sleep(20_000)
		status = await getHTTPStatus(link)
	}
	report({ status, link })
}

async function getHTTPStatus(link) {
	const maxTime = 15_000
	const controller = new AbortController()
	setTimeout(() => controller.abort(), maxTime)

	try {
		const res = await fetch(link, { signal: controller.signal })
		return res.status
	} catch (err) {
		return 499
	}
}

async function report({ status, link }) {
	console.log(status >= 404 ? '❌' : status >= 400 ? '⬛' : '✅', status, link)
	if (status >= 404 && status !== 499) {
		detectedErrors.push({ status, link })
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

;(async () => {
	await Promise.allSettled(
		Array.from({ length: simultaneousItems }).map(processNextQueueItem)
	)
	if (detectedErrors.length > 0) {
		// Formattage spécifique pour récupérer le résultat avec l'action Github
		if (process.argv.slice(2).includes('--ci')) {
			const message = `

			Certains liens référencés ne semblent plus fonctionner :

			| Status HTTP | Lien |
			|---|---|
			${detectedErrors
				.map(({ status, link }) => `| ${status} | ${link} |`)
				.join('\n')}`

			const format = (msg) =>
				msg
					.trim()
					.split('\n')
					.map((line) => line.trim())
					.join('<br />')
			console.log(`::set-output name=comment::${format(message)}`)
		} else if (detectedErrors) {
			console.log(
				'Liens invalides :' +
					detectedErrors
						.map(({ status, link }) => `\n- [${status}] ${link}`)
						.join('')
			)
		}

		console.log('Terminé')
	}
})()
