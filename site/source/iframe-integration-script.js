import { hexToHSL } from './hexToHSL'

let script =
		document.getElementById('script-monentreprise') ||
		document.getElementById('script-simulateur-embauche'),
	moduleName = script.dataset.module || 'simulateur-embauche',
	couleur =
		script.dataset.couleur &&
		encodeURIComponent(
			JSON.stringify(hexToHSL(script.dataset.couleur.toUpperCase()))
		),
	lang = script.dataset.lang || 'fr',
	fr = lang === 'fr',
	baseUrl =
		script.dataset.iframeUrl ||
		(fr ? import.meta.env.VITE_FR_BASE_URL : import.meta.env.VITE_EN_BASE_URL) +
			'/iframes/' +
			moduleName,
	integratorUrl = encodeURIComponent(window.location.href.toString()),
	src =
		baseUrl +
		(baseUrl.indexOf('?') !== -1 ? '&' : '?') +
		`couleur=${couleur}&iframe&integratorUrl=${integratorUrl}&lang=${lang}`

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src,
	style: 'border: none; width: 100%; display: block; height: 700px',
	allow: 'clipboard-write',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}

const links = document.createElement('div')
const moduleToSitePath = {
	'simulateur-embauche': '/simulateurs/salarié',
	'simulateur-autoentrepreneur': '/simulateurs/auto-entrepreneur',
	'simulateur-independant': '/simulateurs/indépendant',
	'simulateur-dirigeantsasu': '/simulateurs/dirigeant-sasu',
}
const simulateurLink =
	import.meta.env.VITE_FR_BASE_URL + moduleToSitePath[moduleName] ?? ''

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
	<a href="${simulateurURL}">
		mon-entreprise.urssaf.fr
	</a>
	</div>
`

script.parentNode.insertBefore(iframe, script)
script.parentNode.insertBefore(links, script)

window.addEventListener('message', function (evt) {
	if (evt.data.kind === 'resize-height') {
		iframe.style.height = evt.data.value + 'px'
	}
})
