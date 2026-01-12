import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSalarié: SimulationConfig = {
	'objectifs exclusifs': [
		'salarié . coût total employeur',
		'salarié . contrat . salaire brut',
		'salarié . contrat . salaire brut . équivalent temps plein',
		'salarié . rémunération . net . à payer avant impôt',
		'salarié . rémunération . net . payé après impôt',
	],
	questions: {
		raccourcis: [
			{
				label: 'Type de contrat',
				dottedName: 'salarié',
			},
			{
				label: 'Temps partiel',
				dottedName: 'salarié . contrat . temps de travail . temps partiel',
			},
			{
				label: 'Emploi franc',
				dottedName:
					'salarié . coût total employeur . aides . emploi franc . éligible',
			},
			{
				label: 'Cadre',
				dottedName: 'salarié . contrat . statut cadre',
			},
			{
				label: 'Heures supplémentaires',
				dottedName: 'salarié . temps de travail . heures supplémentaires',
			},
			{
				label: 'Titres-restaurant',
				dottedName:
					'salarié . rémunération . frais professionnels . titres-restaurant',
			},
			{
				label: 'Impôt',
				dottedName: 'impôt . méthode de calcul',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
		],
		'non prioritaires': [
			'salarié . régimes spécifiques . DFS',
			'entreprise . association non lucrative',
			'entreprise . TVA',
			"situation personnelle . domiciliation fiscale à l'étranger",
			'salarié . régimes spécifiques . impatriés',
		],
		'liste noire': [
			'salarié . cotisations . exonérations . zones lodeom',
			'salarié . cotisations . exonérations . lodeom . zone un . barèmes',
			'salarié . cotisations . exonérations . lodeom . zone deux . barèmes',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
		'salarié . activité partielle': 'non',
		'impôt . méthode de calcul . par défaut': {
			// On utilise le taux neutre qui est plus rapide à calculer et qui correspond
			// à une fiche de paie pour laquelle le taux effectif n'est pas connu
			// (employeur qui n'a pas reçu de taux de la DGFiP ou bien jeune qui démarre
			// un premier travail). cf #1121
			//
			// Pour les hauts revenus le barème au taux neutre pose problème car il
			// provoque des effets de seuils importants (voir #1661). On revient donc à
			// la méthode “au barème” par défaut pour les hauts revenus. La valeur de
			// 6000 €/mois correspond au seuil où les tranches du barème neutre
			// augmentent par paliers de 4% ou 5%.
			variations: [
				{
					si: 'salarié . contrat . salaire brut <= 6000 €/mois',
					alors: "'taux neutre'",
				},
				{
					sinon: "'barème standard'",
				},
			],
		},
	},
}
