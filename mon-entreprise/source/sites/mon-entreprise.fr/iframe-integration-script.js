import { iframeResizer } from 'iframe-resizer'
import logoEnSvg from 'Images/logo-mycompany.svg'
import logoFrSvg from 'Images/logo.svg'
import urssafSvg from 'Images/urssaf.svg'

let script =
		document.getElementById('script-monentreprise') ||
		document.getElementById('script-simulateur-embauche'),
	moduleName = script.dataset.module || 'simulateur-embauche',
	couleur = encodeURIComponent(script.dataset.couleur),
	lang = script.dataset.lang || 'fr',
	fr = lang === 'fr',
	baseUrl =
		script.dataset.iframeUrl ||
		(fr ? process.env.FR_SITE : process.env.EN_SITE).replace(
			'${path}',
			'/iframes/' + moduleName
		),
	integratorUrl = encodeURIComponent(window.location.href.toString()),
	src =
		baseUrl +
		(baseUrl.indexOf('?') !== -1 ? '&' : '?') +
		`couleur=${couleur}&iframe&integratorUrl=${integratorUrl}&lang=${lang}`

const iframe = document.createElement('iframe')
const iframeAttributes = {
	id: 'simulateurEmbauche',
	src,
	style: 'border: none; width: 100%; display: block; height: 500px',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}
iframeResizer(
	{
		interval: 0,
		scrolling: 'auto',
		heightCalculationMethod: 'lowestElement'
	},
	iframe
)

const links = document.createElement('div')
const moduleToSitePath = {
	'simulateur-embauche': '/simulateurs/salarié',
	'simulateur-autoentrepreneur': '/simulateurs/auto-entrepreneur',
	'simulateur-independant': '/simulateurs/indépendant',
	'simulateur-dirigeantsasu': '/simulateurs/dirigeant-sasu'
}
const simulateurLink = (fr ? process.env.FR_SITE : process.env.EN_SITE).replace(
	'${path}',
	moduleToSitePath[moduleName] ?? ''
)
links.innerHTML = `
	<div style="text-align: center; margin-bottom: 2rem; font-size: 80%">
	Ce simulateur est également disponible sur le site  
	<a href="${simulateurLink}" target="_blank">
		mon-entreprise.fr
	</a><br/>
	
	<a href="${simulateurLink}" target="_blank">
			<img
				style="height: 25px; margin: 10px"
				src="${process.env.FR_SITE.replace(
					'${path}',
					'/' + (lang === 'fr' ? logoFrSvg : logoEnSvg)
				)}"
				alt="mon-entreprise.fr : l'assistant officiel du créateur d'entreprise"
			/>
		</a>
		<a href="https://www.urssaf.fr" target="_blank">
			<img
				style="height: 25px; margin: 10px"
				src="${urssafSvg}"
				alt="un service fourni par l'Urssaf"
			/>
		</a>
	</div>
`

script.parentNode.insertBefore(iframe, script)
script.parentNode.insertBefore(links, script)
