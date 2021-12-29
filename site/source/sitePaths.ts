import { map, reduce, toPairs, zipObj } from 'ramda'
import { LegalStatus } from 'Selectors/companyStatusSelectors'

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
type PathFactory = (...args: Array<any>) => LocalizedPath

type SitePathObject<T> = {
	index: LocalizedPath
} & {
	[key in keyof T]: string | PathFactory | SitePathObject<T[key]>
}

const sitePathsFr = {
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
		déclarationIndépendant: '/aide-declaration-independants',
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

const sitePathsEn = {
	...sitePathsFr,
	créer: {
		...sitePathsFr.créer,
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
		déclarationIndépendant: '/declaration-aid-independent',
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
	},
	nouveautés: '/news',
	accessibilité: '/accessibility',

	integration: {
		...sitePathsFr.integration,
		index: '/integration',
		library: '/library',
	},
} as const

function constructSitePaths<T extends SitePathObject<T>>(
	root: string,
	{ index, ...sitePaths }: T
): T {
	return {
		index: root + index,
		...map((value: LocalizedPath | PathFactory | SitePathObject<string>) =>
			typeof value === 'string'
				? root + index + value
				: typeof value === 'function'
				? (...args: Array<unknown>) => root + index + String(value(...args))
				: constructSitePaths(root + index, value as any)
		)(sitePaths as any),
	} as any
}

export const constructLocalizedSitePath = (language: 'en' | 'fr') => {
	const sitePaths = language === 'fr' ? sitePathsFr : sitePathsEn
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

// TODO: HACKY, find a better way to expose this information
const basePathFr = import.meta.env.PROD
	? import.meta.env.VITE_FR_BASE_URL
	: '/mon-entreprise'
const basePathEn = import.meta.env.PROD
	? import.meta.env.VITE_EN_BASE_URL
	: '/infrance'

const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(
	(path) =>
		'http://' +
		(typeof window === 'undefined' ? '' : window.location.host) +
		basePathEn +
		path
)
const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(
	(path) =>
		'http://' +
		(typeof window === 'undefined' ? '' : window.location.host) +
		basePathFr +
		path
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
