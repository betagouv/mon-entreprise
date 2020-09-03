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
	'SA'
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
			LANDING_LEGAL_STATUS_LIST.map(statut => [statut, `/${statut}`])
		) as { [statut in LegalStatus]: string }),
		après: '/après-la-création',
		guideStatut: {
			index: '/statut-juridique',
			liste: '/liste',
			soleProprietorship: '/responsabilité',
			directorStatus: '/dirigeant',
			autoEntrepreneur: '/auto-entrepreneur-ou-entreprise-individuelle',
			multipleAssociates: '/nombre-associés',
			minorityDirector: '/gérant-majoritaire-ou-minoritaire'
		}
	},
	gérer: {
		index: '/gérer',
		embaucher: '/embaucher',
		sécuritéSociale: '/sécurité-sociale',
		déclarationIndépendant: '/aide-declaration-independants',
		formulaireMobilité: '/demande-mobilité'
	},
	simulateurs: {
		index: '/simulateurs',
		SASU: '/dirigeant-sasu',
		indépendant: '/indépendant',
		'auto-entrepreneur': '/auto-entrepreneur',
		comparaison: '/comparaison-régimes-sociaux',
		salarié: '/salaire-brut-net',
		'artiste-auteur': '/artiste-auteur',
		'chômage-partiel': '/chômage-partiel',
		'professionnel-santé': '/professionnel-santé',
		économieCollaborative: {
			index: '/économie-collaborative',
			votreSituation: '/votre-situation'
		}
	},
	nouveautés: '/nouveautés',
	stats: '/stats',
	budget: '/budget',
	integration: {
		index: '/intégration',
		iframe: '/iframe',
		library: '/bibliothèque-de-calcul'
	},
	documentation: {
		index: '/documentation'
	}
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
			minorityDirector: '/chairman-or-managing-director'
		}
	},
	gérer: {
		index: '/manage',
		embaucher: '/hiring',
		sécuritéSociale: '/social-security',
		déclarationIndépendant: '/declaration-aid-independent',
		formulaireMobilité: '/posting-demand'
	},
	simulateurs: {
		index: '/calculators',
		SASU: '/sasu-chairman',
		indépendant: '/independant',
		'auto-entrepreneur': '/auto-entrepreneur',
		comparaison: '/social-scheme-comparaison',
		salarié: '/salary',
		'artiste-auteur': '/artist-author',
		'chômage-partiel': '/partial-unemployement',
		économieCollaborative: {
			index: '/sharing-economy',
			votreSituation: '/your-situation'
		}
	},
	nouveautés: '/news',
	integration: {
		...sitePathsFr.integration,
		index: '/integration',
		library: '/library'
	}
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
		)(sitePaths as any)
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

const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(path =>
	(process.env.EN_SITE || '').replace('${path}', path)
)
const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(path =>
	(process.env.FR_SITE || '').replace('${path}', path)
)

export const hrefLangLink = {
	en: zipObj(
		enSiteMap,
		frSiteMap.map(href => [{ href, hrefLang: 'fr' }])
	),
	fr: zipObj(
		frSiteMap,
		enSiteMap.map(href => [{ href, hrefLang: 'en' }])
	)
}
