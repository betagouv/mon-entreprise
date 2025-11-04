import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { ComparateurConfig } from '@/domaine/ComparateurConfig'
import { IndépendantContexte } from '@/domaine/IndépendantContexte'
import { AutoEntrepreneurContexteDansPublicodes } from '@/domaine/publicodes/AutoEntrepreneurContexteDansPublicodes'

export const configComparateurStatuts: ComparateurConfig = {
	nomModèle: 'modele-social',
	contextes: [
		AssimiléSalariéContexte,
		AutoEntrepreneurContexteDansPublicodes,
		IndépendantContexte,
	],
	'objectifs exclusifs': [],
	objectifs: [
		'dirigeant . rémunération . net',
		'dirigeant . rémunération . net . après impôt',
		'entreprise . activité . nature . libérale . réglementée',
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . base',
		'protection sociale . retraite . complémentaire',
		'protection sociale . maladie . arrêt maladie',
		'protection sociale . maladie . arrêt maladie . délai de carence',
		"protection sociale . maladie . arrêt maladie . délai d'attente",
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités',
		'protection sociale . maladie . maternité paternité adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel',
		'protection sociale . invalidité et décès . pension de reversion',
		'protection sociale . invalidité et décès . pension invalidité . invalidité partielle',
		'protection sociale . invalidité et décès . pension invalidité . invalidité totale',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . capital décès',
		'protection sociale . invalidité et décès . capital décès . orphelin',
	],
	questions: {
		'liste noire': [
			'entreprise . charges',
			"entreprise . chiffre d'affaires",
			'entreprise . imposition',
			'entreprise . imposition . régime',
			'entreprise . imposition . régime . micro-entreprise',
			'entreprise . salariés . effectif . seuil',
			'salarié . rémunération . avantages en nature',
			'entreprise . activités',
			'entreprise . activités . revenus mixtes',
			'entreprise . activités . saisonnière',
		],
		liste: [
			'entreprise . activité',
			'dirigeant . exonérations . ACRE',
			'impôt',
			'entreprise . TVA',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		'entreprise . activités . revenus mixtes': 'non',
		'entreprise . catégorie juridique': "''",
		salarié: 'non',
		'salarié . cotisations . ATMP . taux fonctions support': 'oui',
		"entreprise . chiffre d'affaires": '4000 €/mois',
		'entreprise . charges': '1000 €/mois',
		'entreprise . date de création': "période . début d'année",
		'dirigeant . exonérations . ACRE': 'non',
	},
}
