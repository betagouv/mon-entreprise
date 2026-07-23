import { TFunction } from 'i18next'

import { OpenGraph } from '@/components/utils/Meta'

import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'

export function salariéOpenGraph(t: TFunction, language: string): OpenGraph {
	return {
		title: t(
			'pages.simulateurs.salarié.meta.ogTitle',
			'Salaire brut, net, net après impôt, coût total : le simulateur tout-en-un pour salariés et employeurs'
		),
		description: t(
			'pages.simulateurs.salarié.meta.ogDescription',
			"Optimisez vos finances en un clic ! Calculez instantanément votre revenu net en tant que salarié et évaluez le coût total d'une embauche en tant qu'employeur. Notre simulateur, élaboré avec les experts de l'Urssaf, s'ajuste à votre situation (cadre, stage, apprentissage, heures supplémentaires, avantages, temps partiel, convention collective, etc.) pour des décisions éclairées"
		),
		image:
			language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN,
	}
}
