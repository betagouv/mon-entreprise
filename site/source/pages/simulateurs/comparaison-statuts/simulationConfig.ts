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
		'protection sociale . retraite . trimestres',
		'protection sociale . retraite . base . cotisée',
		'protection sociale . retraite . complémentaire . points acquis',
		'protection sociale . maladie . arrêt maladie',
		// 'protection sociale . maladie . arrêt maladie . délai de carence',
		// "protection sociale . maladie . arrêt maladie . délai d'attente",
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités',
		'protection sociale . maladie . accidents du travail et maladies professionnelles . indemmnités . à partir du 29ème jour',
		'protection sociale . maladie . maternité paternité adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos adoption',
		'protection sociale . maladie . maternité paternité adoption . allocation forfaitaire de repos maternel',
		'protection sociale . invalidité et décès . pension de reversion',
		'protection sociale . invalidité et décès . pension invalidité . invalidité partielle',
		'protection sociale . invalidité et décès . pension invalidité . invalidité totale',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente décès',
		'protection sociale . invalidité et décès . accidents du travail et maladies professionnelles . rente incapacité',
		'protection sociale . invalidité et décès . capital décès',
		'protection sociale . invalidité et décès . capital décès . orphelin',
		'entreprise . coût formalités . création',
	],
	questions: {
		'liste noire': [
			'entreprise . activités',
			'entreprise . activités . saisonnière',
		],
		// liste: ['entreprise . activité', 'impôt', 'entreprise . TVA', ''],
		liste: ['entreprise . TVA'],
	},
	'unité par défaut': '€/mois',
	situation: {
		salarié: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . activité . revenus mixtes': 'non',
		'entreprise . date de création': "période . début d'année",
		"entreprise . chiffre d'affaires": '4000 €/mois',
		'entreprise . charges': '1000 €/mois',
	},
}
