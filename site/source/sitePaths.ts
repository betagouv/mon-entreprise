import { useTranslation } from 'react-i18next'

import { SimulatorDataValues } from '@/pages/simulateurs-et-assistants/metadata-src'

const rawSitePathsFr = {
	index: '',
	assistants: {
		index: 'assistants',
		formulaireMobilité: 'demande-mobilité',
		'recherche-code-ape': 'recherche-code-ape',
		'déclaration-charges-sociales-indépendant':
			'declaration-charges-sociales-independant',
		'déclaration-revenus-pamc': 'declaration-revenus-pam',
		économieCollaborative: {
			index: 'économie-collaborative',
		},
		'pour-mon-entreprise': {
			index: 'pour-mon-entreprise',
			entreprise: ':entreprise',
		},
		déclarationIndépendant: {
			index: 'aide-declaration-independants-v2',
		},
		'choix-du-statut': {
			index: 'choix-du-statut',
			'recherche-activité': 'recherche-activite',
			'détails-activité': 'details-activite',
			commune: 'commune',
			association: 'association',
			associé: 'associe',
			rémunération: 'remuneration',
			comparateur: 'comparateur',
			résultat: {
				index: 'resultat',
				AE: 'auto-entrepreneur',
				EURL: 'EURL',
				SARL: 'SARL',
				EI: 'entreprise-individuelle',
				SASU: 'SASU',
				SAS: 'SAS',
				SELARL: 'SELARL',
				SELARLU: 'SELARLU',
				SELAS: 'SELAS',
				SELASU: 'SELASU',
				association: 'association',
			},
		},
		cmg: {
			index: 'cmg',
			informations: 'informations-générales',
			enfants: 'enfants',
			déclarations: 'déclarations',
			inéligibilité: 'inéligible',
			résultat: 'résultat',
		},
	},
	simulateurs: {
		index: 'simulateurs',
		'coût-création-entreprise': 'cout-creation-entreprise',
		'auto-entrepreneur': 'auto-entrepreneur',
		'entreprise-individuelle': 'entreprise-individuelle',
		eirl: 'eirl',
		sasu: 'sasu',
		eurl: 'eurl',
		indépendant: 'indépendant',
		comparaison: 'comparaison-régimes-sociaux',
		pamc: 'pamc',
		salarié: 'salaire-brut-net',
		'artiste-auteur': 'artiste-auteur',
		'profession-libérale': {
			index: 'profession-liberale',
			médecin: 'medecin',
			pharmacien: 'pharmacien',
			auxiliaire: 'auxiliaire-medical',
			'chirurgien-dentiste': 'chirurgien-dentiste',
			'sage-femme': 'sage-femme',
			avocat: 'avocat',
			'expert-comptable': 'expert-comptable',
			cipav: 'cipav',
		},
		'chômage-partiel': 'chômage-partiel',
		is: 'impot-societe',
		dividendes: 'dividendes',
		'réduction-générale': 'réduction-générale',
		lodeom: 'lodeom',
		'cessation-activité': 'cessation-activité',
		'location-de-logement-meublé': 'location-de-logement-meuble',
	},
	nouveautés: {
		index: 'nouveautés',
		date: ':date',
	},
	stats: 'statistiques',
	accessibilité: 'accessibilité',
	budget: 'budget',
	simulateursEtAssistants: 'simulateurs-et-assistants',
	développeur: {
		index: 'développeur',
		iframe: 'iframe',
		library: 'bibliothèque-de-calcul',
		api: 'api',
		spreadsheet: 'tableur',
	},
	documentation: {
		index: 'documentation',
	},
	plan: 'plan-du-site',
} as const

const rawSitePathsEn = {
	...rawSitePathsFr,
	assistants: {
		index: 'assistants',
		formulaireMobilité: 'posting-demand',
		'recherche-code-ape': 'search-code-ape',
		'déclaration-charges-sociales-indépendant':
			'declaration-social-charges-independent',
		'déclaration-revenus-pamc': 'income-declaration-pam',
		économieCollaborative: {
			index: 'sharing-economy',
			votreSituation: 'your-situation',
		},
		'pour-mon-entreprise': {
			index: 'for-my-business',
			entreprise: ':entreprise',
		},
		déclarationIndépendant: {
			index: 'declaration-aid-independent-v2',
		},
		'choix-du-statut': {
			index: 'choice-of-status',
			'recherche-activité': 'recherche-activite',
			'détails-activité': 'details-activite',
			après: 'after-registration',
			commune: 'commune',
			association: 'association',
			associé: 'partnership',
			rémunération: 'remuneration',
			comparateur: 'comparator',
			résultat: {
				index: 'result',
				AE: 'auto-entrepreneur',
				EURL: 'EURL',
				SARL: 'SARL',
				EI: 'entreprise-individuelle',
				SASU: 'SASU',
				SAS: 'SAS',
				SELARL: 'SELARL',
				SELARLU: 'SELARLU',
				SELAS: 'SELAS',
				SELASU: 'SELASU',
				association: 'association',
			},
		},
		cmg: {
			index: 'cmg',
			informations: 'general-information',
			enfants: 'children',
			déclarations: 'declarations',
			inéligibilité: 'ineligible',
			résultat: 'result',
		},
	},
	simulateurs: {
		index: 'calculators',
		'coût-création-entreprise': 'coût-création-entreprise',
		indépendant: 'independant',
		'entreprise-individuelle': 'sole-proprietorship',
		'auto-entrepreneur': 'auto-entrepreneur',
		eirl: 'eirl',
		sasu: 'sasu',
		eurl: 'eurl',
		pamc: 'pamc',
		comparaison: 'social-scheme-comparaison',
		salarié: 'salary',
		'artiste-auteur': 'artist-author',
		'chômage-partiel': 'partial-unemployement',
		'profession-libérale': {
			index: 'liberal-profession',
			médecin: 'doctor',
			pharmacien: 'pharmacist',
			auxiliaire: 'medical-auxiliary',
			'chirurgien-dentiste': 'dental-surgeon',
			'sage-femme': 'midwife',
			avocat: 'lawyer',
			'expert-comptable': 'accountant',
			cipav: 'cipav',
		},
		is: 'corporate-tax',
		dividendes: 'dividends',
		'réduction-générale': 'réduction-générale',
		lodeom: 'lodeom',
		'cessation-activité': 'cessation-of-activity',
		'location-de-logement-meublé': 'furnished-accommodation',
	},
	nouveautés: {
		index: 'news',
		date: ':date',
	},
	stats: 'statistics',
	accessibilité: 'accessibility',
	simulateursEtAssistants: 'simulators-and-assistants',
	développeur: {
		...rawSitePathsFr.développeur,
		index: 'developer',
		library: 'library',
		api: 'api',
		spreadsheet: 'spreadsheet',
	},
	plan: 'sitemap',
} as const

/**
 * Le but des types suivants est d'obtenir un typage statique des chaînes de caractères
 * comme "simulateurs.auto-entrepreneur" utilisés comme identifiants des routes (via les pathId dans metadata-src.ts).
 * Cela permet de ne pas avoir de faute dans les clés comme 'aide-embauche' au lieu de 'aides-embauche'
 */

// Transfrom string type like PathToType<'simulateurs.auto-entrepreneur', number>
// into { simulateurs : { auto-entrepreneur: number }}
type PathToType<T extends string, W> = T extends `${infer U}.${infer V}`
	? { [key in U]: V extends string ? PathToType<V, W> : never }
	: { [key in T]: W }

// Transform type A | B into A & B
type UnionToIntersection<T> = (
	T extends unknown ? (x: T) => void : never
) extends (x: infer R) => void
	? R
	: never

// Union of pathId
type PathIds = SimulatorDataValues['pathId']

type RequiredPath = Required<UnionToIntersection<PathToType<PathIds, string>>>

// If there is a type error here, check rawSitePathsFr object matches the metadata-src.ts pathId
const checkedSitePathsFr = rawSitePathsFr satisfies RequiredPath

// If there is a type error here, check rawSitePathsEn object matches the metadata-src.ts pathId
const checkedSitePathsEn = rawSitePathsEn satisfies RequiredPath

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SitePathsFr = typeof checkedSitePathsFr
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SitePathsEn = typeof checkedSitePathsEn

type GenericSitePath = { [key: string]: string | GenericSitePath }

const encodeRelativeSitePaths = <T extends GenericSitePath>(base: T): T => {
	const sitepaths = Object.entries(base).reduce(
		(obj, [key, val]) => ({
			...obj,
			[key]: typeof val === 'string' ? val : encodeRelativeSitePaths(val),
		}),
		{} as T
	)

	return sitepaths
}

const encodedRelativeSitePaths = encodeRelativeSitePaths({
	fr: rawSitePathsFr,
	en: rawSitePathsEn,
})

const encodedAbsoluteSitePaths = {
	fr: constructAbsoluteSitePaths(rawSitePathsFr),
	en: constructAbsoluteSitePaths(rawSitePathsEn),
}

export const relativeSitePaths = encodedRelativeSitePaths
export const absoluteSitePaths = encodedAbsoluteSitePaths

export type RelativeSitePaths =
	(typeof relativeSitePaths)[keyof typeof relativeSitePaths]
export type AbsoluteSitePaths =
	(typeof absoluteSitePaths)[keyof typeof absoluteSitePaths]

export const useSitePaths = <T extends 'fr' | 'en'>(lang?: T) => {
	const { language } = useTranslation().i18n
	lang ??= language as T

	return {
		relativeSitePaths: relativeSitePaths[lang],
		absoluteSitePaths: absoluteSitePaths[lang],
	}
}

type SitePath = { [key: string]: string | SitePath } & { index: string }

type SitePathBuilt<T extends SitePath, Root extends string = ''> = {
	[K in keyof T]: T[K] extends string
		? K extends 'index'
			? `${Root}${T[K]}` extends ''
				? '/'
				: `${Root}${T[K]}`
			: T extends { index: string }
			? `${Root}${T['index']}/${T[K]}`
			: `${Root}${T[K]}`
		: SitePathBuilt<
				T[K] extends SitePath ? T[K] : never,
				T extends { index: string } ? `${Root}${T['index']}/` : `${Root}`
		  >
}

function constructAbsoluteSitePaths<T extends SitePath>(
	obj: T,
	root = ''
): SitePathBuilt<T> {
	const { index } = obj
	const entries = Object.entries(obj)

	return Object.fromEntries(
		entries.map(([k, value]) => [
			k,
			typeof value === 'string'
				? root + (k === 'index' ? value : index + '/' + value) || '/'
				: constructAbsoluteSitePaths(value, root + index + '/'),
		])
	) as SitePathBuilt<T>
}

type Obj = { [k: string]: string | Obj }

const deepReduce = (
	fn: (acc: string[], val: string, key: string) => string[],
	initialValue: string[],
	object: Obj
): string[] =>
	Object.entries(object).reduce(
		(acc, [key, value]) =>
			typeof value === 'object'
				? deepReduce(fn, acc, value)
				: fn(acc, value, key),
		initialValue
	)

type SiteMap = Array<string>

export const generateSiteMap = (sitePaths: AbsoluteSitePaths): SiteMap =>
	deepReduce(
		(paths: Array<string>, path: string) =>
			/\/:/.test(path) ? paths : [...paths, ...[path]],
		[],
		sitePaths
	)

export const alternatePathname = () => {
	type Lang = 'fr' | 'en'
	type Sitepath = { [k: string]: string | Sitepath }
	type LangSitepath = { [k in Lang]: string }
	type Return = { [k: string]: LangSitepath | Return }

	const buildSitemap = (
		lang: Lang,
		sitePath: Sitepath,
		initialValue: Return = {}
	): Return =>
		Object.entries(sitePath).reduce(
			(acc, [key, path]): Return =>
				typeof path === 'object'
					? { ...acc, [key]: buildSitemap(lang, path, acc[key] as Return) }
					: ({ ...acc, [key]: { ...acc[key], [lang]: path } } as Return),
			initialValue
		)

	const buildPathname = (
		sitemap: Return,
		initialValue: Record<Lang, Record<string, string>> = { fr: {}, en: {} }
	) =>
		Object.values(sitemap).reduce(
			(acc, obj): Record<Lang, Record<string, string>> =>
				typeof obj === 'object' && ('fr' in obj || 'en' in obj)
					? {
							fr: {
								...acc.fr,
								...('fr' in obj
									? { [obj.fr as string]: (obj.en || obj.fr) as string }
									: null),
							},
							en: {
								...acc.en,
								...('en' in obj
									? { [obj.en as string]: (obj.fr || obj.en) as string }
									: null),
							},
					  }
					: buildPathname(obj, acc),
			initialValue
		)

	return buildPathname(
		buildSitemap(
			'en',
			absoluteSitePaths.en,
			buildSitemap('fr', absoluteSitePaths.fr)
		)
	)
}
