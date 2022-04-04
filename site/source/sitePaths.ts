import { MetadataSrc } from 'pages/Simulateurs/metadata-src'
import { map, reduce, toPairs, zipObj } from 'ramda'
import { LegalStatus } from '@/selectors/companyStatusSelectors'

export const LANDING_LEGAL_STATUS_LIST: Array<LegalStatus> = [
	'EI',
	'EIRL',
	'EURL',
	'SAS',
	'SARL',
	'SASU',
	'auto-entrepreneur',
	'auto-entrepreneur-EIRL',
	'SA',
]

type LocalizedPath = string
type SitePathObject<T> = {
	index: LocalizedPath
} & {
	[key in keyof T]: string | SitePathObject<T[key]>
}

const rawSitePathsFr = {
	index: '',
	créer: {
		index: '/créer',
		...(Object.fromEntries(
			LANDING_LEGAL_STATUS_LIST.map((statut) => [statut, `/${statut}`])
		) as { [statut in LegalStatus]: string }),
		après: '/après-la-création',
		guideStatut: {
			index: '/statut-juridique',
			liste: '/liste',
			soleProprietorship: '/responsabilité',
			directorStatus: '/dirigeant',
			autoEntrepreneur: '/auto-entrepreneur-ou-entreprise-individuelle',
			multipleAssociates: '/nombre-associés',
			minorityDirector: '/gérant-majoritaire-ou-minoritaire',
		},
	},
	gérer: {
		index: '/gérer',
		embaucher: '/embaucher',
		sécuritéSociale: '/sécurité-sociale',
		'déclaration-charges-sociales-indépendant':
			'/declaration-charges-sociales-independant',
		déclarationIndépendant: {
			index: '/aide-declaration-independants',
			entreprise: '/entreprise',
			imposition: '/imposition',
			déclaration: '/declaration',
			cotisations: '/cotisations',
		},
		formulaireMobilité: '/demande-mobilité',
	},
	simulateurs: {
		index: '/simulateurs',
		'auto-entrepreneur': '/auto-entrepreneur',
		'entreprise-individuelle': '/entreprise-individuelle',
		eirl: '/eirl',
		sasu: '/sasu',
		eurl: '/eurl',
		indépendant: '/indépendant',
		comparaison: '/comparaison-régimes-sociaux',
		pamc: '/pamc',
		salarié: '/salaire-brut-net',
		'artiste-auteur': '/artiste-auteur',
		'profession-libérale': {
			index: '/profession-liberale',
			médecin: '/medecin',
			pharmacien: '/pharmacien',
			auxiliaire: '/auxiliaire-medical',
			'chirurgien-dentiste': '/chirurgien-dentiste',
			'sage-femme': '/sage-femme',
			avocat: '/avocat',
			'expert-comptable': '/expert-comptable',
		},
		'chômage-partiel': '/chômage-partiel',
		économieCollaborative: {
			index: '/économie-collaborative',
			votreSituation: '/votre-situation',
		},
		is: '/impot-societe',
		'aides-embauche': '/aides-embauche',
		dividendes: '/dividendes',
		'exonération-covid': '/exonération-covid',
	},
	nouveautés: '/nouveautés',
	stats: '/stats',
	accessibilité: '/accessibilité',
	budget: '/budget',
	integration: {
		index: '/intégration',
		iframe: '/iframe',
		library: '/bibliothèque-de-calcul',
	},
	documentation: {
		index: '/documentation',
	},
} as const

const rawSitePathsEn = {
	...rawSitePathsFr,
	créer: {
		...rawSitePathsFr.créer,
		index: '/create',
		après: '/after-registration',
		guideStatut: {
			index: '/legal-status',
			liste: '/list',
			soleProprietorship: '/liability',
			directorStatus: '/director',
			autoEntrepreneur: '/auto-entrepreneur',
			multipleAssociates: '/multiple-associates',
			minorityDirector: '/chairman-or-managing-director',
		},
	},
	gérer: {
		index: '/manage',
		embaucher: '/hiring',
		sécuritéSociale: '/social-security',
		'déclaration-charges-sociales-indépendant':
			'/declaration-social-charges-independent',
		déclarationIndépendant: {
			index: '/declaration-aid-independent',
			imposition: '/taxation',
			entreprise: '/company',
			déclaration: '/declaration',
			cotisations: '/contributions',
		},
		formulaireMobilité: '/posting-demand',
	},
	simulateurs: {
		index: '/calculators',
		indépendant: '/independant',
		'entreprise-individuelle': '/sole-proprietorship',
		'auto-entrepreneur': '/auto-entrepreneur',
		eirl: '/eirl',
		sasu: '/sasu',
		eurl: '/eurl',
		pamc: '/pamc',
		comparaison: '/social-scheme-comparaison',
		salarié: '/salary',
		'artiste-auteur': '/artist-author',
		'chômage-partiel': '/partial-unemployement',
		'profession-libérale': {
			index: '/liberal-profession',
			médecin: '/doctor',
			pharmacien: '/pharmacist',
			auxiliaire: '/medical-auxiliary',
			'chirurgien-dentiste': '/dental-surgeon',
			'sage-femme': '/midwife',
			avocat: '/lawyer',
			'expert-comptable': '/accountant',
		},
		économieCollaborative: {
			index: '/sharing-economy',
			votreSituation: '/your-situation',
		},
		is: '/corporate-tax',
		'aides-embauche': '/hiring-incentives',
		dividendes: '/dividends',
		'exonération-covid': '/exoneration-covid',
	},
	nouveautés: '/news',
	accessibilité: '/accessibility',

	integration: {
		...rawSitePathsFr.integration,
		index: '/integration',
		library: '/library',
	},
} as const

/**
 * Le but des types suivants est d'obtenir un typage statique des chaînes de caractères
 * comme "simulateurs.auto-entrepreneur" utilisés comme identifiants des routes (via les pathId dans metadat-src.ts).
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
type PathIds = MetadataSrc[keyof MetadataSrc]['pathId']

type RequiredPath = Required<UnionToIntersection<PathToType<PathIds, string>>>

// If there is a type error here, check rawSitePathsFr object matches the metadata-src.ts pathId
const checkedSitePathsFr: RequiredPath & typeof rawSitePathsFr = rawSitePathsFr

// If there is a type error here, check rawSitePathsEn object matches the metadata-src.ts pathId
const checkedSitePathsEn: RequiredPath & typeof rawSitePathsEn = rawSitePathsEn

function constructSitePaths<T extends SitePathObject<T>>(
	root: string,
	{ index, ...sitePaths }: T
): T {
	return {
		index: root + index,
		...map((value: LocalizedPath | SitePathObject<string>) =>
			typeof value === 'string'
				? root + index + value
				: constructSitePaths(root + index, value as any)
		)(sitePaths as any),
	} as any
}

export const constructLocalizedSitePath = (language: 'en' | 'fr') => {
	const sitePaths = language === 'fr' ? checkedSitePathsFr : checkedSitePathsEn

	return constructSitePaths('', sitePaths)
}

export type SitePathsType = ReturnType<typeof constructLocalizedSitePath>

const deepReduce = (fn: any, initialValue?: any, object?: any): any =>
	reduce(
		(acc, [key, value]) =>
			typeof value === 'object'
				? deepReduce(fn, acc, value)
				: fn(acc, value, key),
		initialValue,
		toPairs(object)
	)

type SiteMap = Array<string>

export const generateSiteMap = (sitePaths: SitePathsType): SiteMap =>
	deepReduce(
		(paths: Array<string>, path: string) => [...paths, ...[path]],
		[],
		sitePaths
	)

const basePathFr =
	import.meta.env.DEV && typeof window !== 'undefined'
		? `http://${window.location.host}/mon-entreprise`
		: import.meta.env.VITE_FR_BASE_URL ?? ''

const basePathEn =
	import.meta.env.DEV && typeof window !== 'undefined'
		? `http://${window.location.host}/infrance`
		: import.meta.env.VITE_EN_BASE_URL ?? ''

const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(
	(path) => basePathEn + path
)
const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(
	(path) => basePathFr + path
)

export const hrefLangLink = {
	en: zipObj(
		enSiteMap,
		frSiteMap.map((href) => [{ href, hrefLang: 'fr' }])
	),
	fr: zipObj(
		frSiteMap,
		enSiteMap.map((href) => [{ href, hrefLang: 'en' }])
	),
}
