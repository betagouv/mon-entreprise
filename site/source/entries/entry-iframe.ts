/**
 * Ce script contient la logique pour créer l'iframe et gérer son redimensionnement
 * Il doit rester très léger (<1ko), car il est inclus directement sur les sites hôtes
 * Par ailleurs, la config de bundling est spécifique (vite-iframe-script.config.ts).
 *
 * 🚨🚨🚨 POUR CES RAISONS, NE PAS FAIRE D'IMPORT DE FICHIERS DE L'APP ICI 🚨🚨🚨
 *
 * Cela pourrait faire grossir l'abre de dépendance de manière incontrollée et
 * aboutir à des bugs liés à une config de bundling différentes.
 **/

// @ts-ignore ignore file not exist error
import simulationData from '@/public/simulation-data-title.json' assert { type: 'json' }
import { hexToHSL } from '@/utils/hexToHSL'
import { setupIframeMessageHandlers } from '@/utils/iframeMessageHandlers'

type KeyofSimulationData = keyof typeof simulationData

const script = document.currentScript
if (!script) {
	throw new Error('document.currentScript is null or undefined')
}
const iframePath =
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	(script.dataset.module as KeyofSimulationData | undefined) ||
	'simulateur-embauche'

const moduleData = simulationData[iframePath]

const moduleIframeTitle = moduleData?.title || ''

const couleur =
	script.dataset.couleur &&
	encodeURIComponent(JSON.stringify(hexToHSL(script.dataset.couleur)))

const lang = script.dataset.lang || 'fr'

const src = new URL(
	(lang === 'fr'
		? import.meta.env.VITE_FR_BASE_URL
		: import.meta.env.VITE_EN_BASE_URL) +
		'/iframes/' +
		(iframePath as string)
)

src.searchParams.set(
	'integratorUrl',
	encodeURIComponent(window.location.href.toString())
)
src.searchParams.set('lang', lang)
if (couleur) {
	src.searchParams.set('couleur', couleur)
}

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src: src.toString(),
	style: 'border: none; width: 100%; display: block; height: 700px',
	allow: 'clipboard-write, webshare',
	allowfullscreen: 'true',
	webkitallowfullscreen: 'true',
	mozallowfullscreen: 'true',
	title: moduleIframeTitle,
}
for (const key in iframeAttributes) {
	iframe.setAttribute(
		key,
		iframeAttributes[key as keyof typeof iframeAttributes]
	)
}

const links = document.createElement('div')
const moduleToSitePath = {
	'simulateur-embauche': '/simulateurs/salaire-brut-net',
	'simulateur-autoentrepreneur': '/simulateurs/auto-entrepreneur',
	'simulateur-independant': '/simulateurs/indépendant',
	'simulateur-assimilesalarie': '/simulateurs/sasu',
}

const simulateurLink =
	import.meta.env.VITE_FR_BASE_URL +
	(iframePath in moduleToSitePath
		? moduleToSitePath[iframePath as keyof typeof moduleToSitePath]
		: '/')

const url = new URL(simulateurLink)

const params = new URLSearchParams(url.search)

params.append('utm_source', 'iframe')
params.append('utm_medium', 'iframe')
params.append('utm_campaign', 'newtext')
url.search = params.toString()
const simulateurURL = url.toString()

links.innerHTML = `
	<div style="text-align: center; margin-bottom: 2rem; font-size: 80%">
	Retrouvez ce simulateur et bien d'autres sur
	<a href="${simulateurURL}" target="_blank" rel="noopener" aria-label="mon-entreprise.urssaf.fr, nouvelle fenêtre">
		mon-entreprise.urssaf.fr
	</a>
	</div>
`

if (script.parentElement?.tagName === 'HEAD') {
	document.body.appendChild(iframe)
	document.body.appendChild(links)
}
script.before(iframe)
script.before(links)

const handlers = setupIframeMessageHandlers(iframe)
window.addEventListener('beforeunload', handlers.cleanup)
