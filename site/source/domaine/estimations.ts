import { DottedName } from 'modele-social'

type Unité = '€/an' | '€/mois'

interface Estimation {
	règleCible: DottedName
	label?: string
	unité?: Unité
}

export const estimationDImpactPourUneRègle = (
	règle: DottedName
): Estimation | null => {
	if (règle === 'location de logement meublé . affiliation . RG') {
		return {
			règleCible: 'location de logement meublé . cotisations . régime général',
			label: 'estimation de cotisations',
			unité: '€/an',
		}
	}
	if (règle === 'location de logement meublé . affiliation . TI') {
		return {
			règleCible:
				'location de logement meublé . cotisations . régime travailleur indépendant',
			label: 'estimation de cotisations',
			unité: '€/an',
		}
	}
	if (règle === 'location de logement meublé . affiliation . ME') {
		return {
			règleCible:
				'location de logement meublé . cotisations . régime micro-entreprise',
			label: 'estimation de cotisations',
			unité: '€/an',
		}
	}

	return null
}
