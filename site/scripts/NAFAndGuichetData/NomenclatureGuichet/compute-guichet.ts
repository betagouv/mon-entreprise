import { Activity, CodeGuichet } from './extract.js'

/**
 * The type `GuichetEntry` defines the properties and their types for a data entry of the Guichet Unique classification.
 */
type GuichetEntry = {
	/**
	 * This property represents the main affiliation of a business or individual with a social security
	 * organization. It can have one of three possible values: 'MSA' (Mutualité Sociale Agricole), 'ACOSS'
	 * (Agence Centrale des Organismes de Sécurité Sociale) or ENIM (le régime social des marins)
	 */
	affiliationPrincipale: 'MSA' | 'ACOSS' | 'ENIM'
	catégorieActivité:
		| 'AGENT COMMERCIAL'
		| 'AGRICOLE'
		| 'ARTISANALE_REGLEMENTEE'
		| 'ARTISANALE'
		| 'COMMERCIALE'
		| 'GESTION DE BIENS'
		| 'LIBERALE_NON_REGLEMENTEE'
		| 'LIBERALE_REGLEMENTEE'
		| undefined
	typeBénéfice: 'BNC' | 'BIC' | 'BA'
	artisteAuteurPossible: boolean
	caisseDeRetraiteSpéciale:
		| Exclude<Activity['Caisse de retraite spéciale'], ''>
		| false
	code: string
	label: {
		niv1: string
		niv2: string
		niv3: string
		niv4: string | null
	}
}

function getCatégorieActivité(
	activity: Activity
): GuichetEntry['catégorieActivité'] {
	const formeActivitéEffectifsRéduits =
		activity[
			'Forme exercice Activité si  effectif < 11 (hors prolongement agricole)'
		]
	const formeActivitéSansJQPA =
		activity[
			"Forme exercice d'activité si JQPA non revendiquée (hors proongement agricole)"
		]
	const formeActivité =
		formeActivitéEffectifsRéduits === 'Non applicable'
			? formeActivitéSansJQPA
			: formeActivitéEffectifsRéduits

	return formeActivité.includes('AGRICOLE')
		? 'AGRICOLE'
		: formeActivité === 'Non applicable'
		? undefined
		: (formeActivité as GuichetEntry['catégorieActivité'])
}

function getTypeBénéfice(activity: Activity): GuichetEntry['typeBénéfice'] {
	const microBenefice =
		activity[
			'si microEntreprise = true, déduction de regimeImpositionBenefices'
		]

	return microBenefice.includes('BA')
		? 'BA'
		: microBenefice.includes('BNC')
		? 'BNC'
		: 'BIC'
}

export function computeGuichet(
	activities: Array<Activity>
): Record<CodeGuichet, GuichetEntry> {
	return activities.reduce(
		(acc, activity) => {
			const catégorieActivité = getCatégorieActivité(activity)

			acc[activity['Code final']] = {
				catégorieActivité,
				affiliationPrincipale:
					activity['Affiliation si principale (hors prolongement agricole)'],
				caisseDeRetraiteSpéciale:
					activity['Caisse de retraite spéciale'] || false,
				artisteAuteurPossible:
					activity['Encodage ACOSS'].includes('ArtisteAuteur'),
				typeBénéfice: getTypeBénéfice(activity),
				code: activity['Code final'],
				label: {
					niv1: activity['Niv. 1'],
					niv2: activity['Niv. 2'],
					niv3: activity['Niv. 3'],
					niv4: activity['Niv. 4'],
				},
			}

			return acc
		},
		{} as Record<CodeGuichet, GuichetEntry>
	)
}
