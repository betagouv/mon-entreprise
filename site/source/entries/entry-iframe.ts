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
import simulationData from '../public/simulation-data-title.json'
import { hexToHSL } from '../utils/hexToHSL'

const script = document.currentScript
if (!script) {
	throw new Error('document.currentScript is null or undefined')
}
const moduleName =
	(script.dataset.module as keyof typeof simulationData | undefined) ||
	'salarié'

const moduleData = simulationData[moduleName]

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
		(moduleName as string)
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
	allow: 'clipboard-write',
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
	'simulateur-dirigeantsasu': '/simulateurs/dirigeant-sasu',
}

const simulateurLink =
	import.meta.env.VITE_FR_BASE_URL +
	(moduleName in moduleToSitePath
		? moduleToSitePath[moduleName as keyof typeof moduleToSitePath]
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

script.before(iframe)
script.before(links)

window.addEventListener(
	'message',
	function (evt: MessageEvent<{ kind: string; value: number }>) {
		if (evt.data.kind === 'resize-height') {
			iframe.style.height = `${evt.data.value}px`
		}
		if (evt.data.kind === 'get-offset') {
			const iframePosition = iframe.getBoundingClientRect()
			iframe.contentWindow?.postMessage(
				{ kind: 'offset', value: Math.max(iframePosition.top * -1, 0) },
				'*'
			)
		}
	}
)
