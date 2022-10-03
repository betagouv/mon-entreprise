import {
	iframeAEPath,
	iframeArtisteAuteurPath,
	iframeAssimileSalariePath,
	iframeChoixStatutPath,
	iframeChomagePartielPath,
	iframeEconomieCollaborativePath,
	iframeEIPath,
	iframeEIRLPath,
	iframeEmbauchePath,
	iframeEURLPath,
	iframeIndependantPath,
	iframeAuxiliaireMedicalPath,
	iframeAvocatPath,
	iframeChargeSocialesPath,
	iframeChirurgienDentistePath,
	iframeDemandeMobilitePath,
	iframeDividendePath,
	iframeExonerationCovid,
	iframeExpertComptable,
	iframeImpotSocietePath,
	iframeMedecinPath,
	iframePAMCPath,
	iframePharmacienPath,
	iframeProfessionLiberalePath,
	iframeRevenuIndependant,
	iframeSageFemmePath,
} from './constants/iframePaths'
import { hexToHSL } from './hexToHSL'

const iframeTitles = {
	[iframeEmbauchePath]: 'Simulateur de revenus pour salarié',
	[iframeEIPath]: 'Simulateur de revenus pour entreprise individuelle',
	[iframeEIRLPath]: 'Simulateur de revenus pour EIRL',
	[iframeAssimileSalariePath]: 'Simulateur de revenus pour dirigeant de SASU',
	[iframeEURLPath]: "Simulateur de revenus pour dirigeant d'EURL",
	[iframeAEPath]: 'Simulateur de revenus pour auto-entrepreneur',
	[iframeIndependantPath]: 'Simulateur de revenus pour indépendant',
	[iframeArtisteAuteurPath]: 'Simulateurs de cotisations d’artiste-auteur',
	[iframeChomagePartielPath]:
		"Simulateur du calcul de l'indemnité chômage partiel (Covid-19)",
	[iframeChoixStatutPath]: 'Assistant au choix du statut juridique',
	[iframeEconomieCollaborativePath]:
		'Assistant à la déclaration des revenus des plateformes en ligne',
	[iframeChargeSocialesPath]:
		'Assistant à la détermination des charges sociales déductibles',
	[iframeRevenuIndependant]:
		'Assistant à la détermination des charges sociales déductibles',
	[iframeDemandeMobilitePath]: 'Simulateur de demande de mobilité',
	[iframePharmacienPath]: 'Simulateur de revenus pour pharmacien en libéral',
	[iframeMedecinPath]: 'Simulateur de revenus pour médecin en libéral',
	[iframeChirurgienDentistePath]:
		'Simulateur de revenus pour chirurgien-dentiste en libéral',
	[iframeSageFemmePath]: 'Simulateur de revenus pour sage-femme en libéral',
	[iframeAuxiliaireMedicalPath]:
		'Simulateur de revenus pour auxiliaire médical en libéral',
	[iframeAvocatPath]: 'Simulateur de revenus pour avocat en libéral',
	[iframeExpertComptable]:
		'Simulateur de revenus pour expert comptable et commissaire aux comptes en libéral',
	[iframeProfessionLiberalePath]:
		'Simulateur de revenus pour profession libérale',
	[iframePAMCPath]: 'Simulateurs de cotisations et de revenu pour les PAMC',
	[iframeImpotSocietePath]: "Simulateur d'impôt sur les sociétés",
	[iframeDividendePath]: 'Simulateur de versement de dividendes',
	[iframeExonerationCovid]:
		'Simulateur d’exonération de cotisations Covid pour indépendant',
}

const script = document.currentScript
const moduleName = script.dataset.module || 'simulateur-embauche'

const moduleIframeTitle = iframeTitles[moduleName]

const couleur =
	script.dataset.couleur &&
	encodeURIComponent(JSON.stringify(hexToHSL(script.dataset.couleur)))

const lang = script.dataset.lang || 'fr'

const src = new URL(
	(lang === 'fr'
		? import.meta.env.VITE_FR_BASE_URL
		: import.meta.env.VITE_EN_BASE_URL) +
		'/iframes/' +
		moduleName
)

src.searchParams.set('iframe', true)
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
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
	title: moduleIframeTitle,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}

const links = document.createElement('div')
const moduleToSitePath = {
	'simulateur-embauche': '/simulateurs/salaire-brut-net',
	'simulateur-autoentrepreneur': '/simulateurs/auto-entrepreneur',
	'simulateur-independant': '/simulateurs/indépendant',
	'simulateur-dirigeantsasu': '/simulateurs/dirigeant-sasu',
}

const simulateurLink =
	import.meta.env.VITE_FR_BASE_URL + (moduleToSitePath[moduleName] ?? '/')

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
	<a href="${simulateurURL}" target="_blank" rel="noopener">
		mon-entreprise.urssaf.fr
	</a>
	</div>
`

script.before(iframe)
script.before(links)

window.addEventListener('message', function (evt) {
	if (evt.data.kind === 'resize-height') {
		iframe.style.height = evt.data.value + 'px'
	}
	if (evt.data.kind === 'get-offset') {
		const iframePosition = iframe.getBoundingClientRect()
		iframe.contentWindow?.postMessage(
			{ kind: 'offset', value: Math.max(iframePosition.top * -1, 0) },
			'*'
		)
	}
})
