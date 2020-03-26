import { encodeRuleName } from 'Engine/ruleUtils'
import { map, reduce, toPairs, zipObj } from 'ramda'
import { LegalStatus } from 'Selectors/companyStatusSelectors'
import { DottedName } from 'Types/rule'
import i18n from '../../i18n'

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

const translateTo = (language: string) => (
	str1: string,
	str2: string,
	options = {}
) =>
	i18n.t([str1, str2].filter(Boolean), {
		...(language ? { lng: language } : {}),
		...options
	})

interface HasIndex {
	index: string
}

type SitePathsObject<T> = {
	[key in keyof T]: string | Function | SitePathsObject<T[key]>
}

function constructSitePaths<T extends SitePathsObject<HasIndex>>(
	root: string,
	{ index, ...sitePaths }: T
): T {
	return {
		index: root + index,
		...map(value =>
			typeof value === 'string'
				? root + index + value
				: typeof value === 'function'
				? (...args: any) => root + index + String(value(...args))
				: constructSitePaths(root + index, value as any)
		)(sitePaths as any)
	} as any
}

export const constructLocalizedSitePath = (language: string) => {
	const t = translateTo(language)
	return constructSitePaths('', {
		index: '',
		créer: {
			index: t('path.créer.index', '/créer'),
			...(Object.fromEntries(
				LANDING_LEGAL_STATUS_LIST.map(statut => [statut, `/${statut}`])
			) as { [statut in LegalStatus]: string }),
			après: t('path.créer.après', '/créer/après-la-création'),
			guideStatut: {
				index: t('path.créer.guideStatut.index', '/statut-juridique'),
				liste: t('path.créer.guideStatut.liste', '/liste'),
				soleProprietorship: t(
					'path.créer.guideStatut.responsabilité',
					'/responsabilité'
				),
				directorStatus: t(
					'path.créer.guideStatut.statutDirigeant',
					'/dirigeant'
				),
				autoEntrepreneur: t(
					'path.créer.guideStatut.autoEntrepreneur',
					'/auto-entrepreneur-ou-entreprise-individuelle'
				),
				multipleAssociates: t(
					'path.créer.guideStatut.nombreAssociés',
					'/nombre-associés'
				),
				minorityDirector: t(
					'path.créer.guideStatut.gérantMinoritaire',
					'/gérant-majoritaire-ou-minoritaire'
				)
			}
		},
		gérer: {
			index: t('path.gérer.index', '/gérer'),
			embaucher: t('path.gérer.embaucher', '/embaucher'),
			sécuritéSociale: t('path.gérer.sécuritéSociale', '/sécurité-sociale'),
			déclarationIndépendant: {
				index: t(
					'path.gérer.déclaration-indépendant.index',
					'/aide-declaration-independants'
				),
				récapitulatif: t(
					'path.gérer.déclaration-indépendant.récapitulatif',
					'/récapitulatif'
				)
			}
		},
		simulateurs: {
			index: t('path.simulateurs.index', '/simulateurs'),
			'assimilé-salarié': t(
				'path.simulateurs.assimilé-salarié',
				'/assimilé-salarié'
			),
			indépendant: t('path.simulateurs.indépendant', '/indépendant'),
			'auto-entrepreneur': t(
				'path.simulateurs.auto-entrepreneur',
				'/auto-entrepreneur'
			),
			comparaison: t(
				'path.simulateurs.comparaison',
				'/comparaison-régimes-sociaux'
			),
			salarié: t('path.simulateurs.salarié', '/salarié'),
			'artiste-auteur': t('path.simulateurs.artiste-auteur', '/artiste-auteur')
		},
		économieCollaborative: {
			index: t('path.économieCollaborative.index', '/économie-collaborative'),
			votreSituation: t(
				'path.économieCollaborative.votreSituation',
				'/votre-situation'
			)
		},
		nouveautés: t('path.nouveautés', '/nouveautés'),
		documentation: {
			index: t('path.documentation.index', '/documentation'),
			rule: (dottedName: DottedName) => '/' + encodeRuleName(dottedName)
		},
		coronavirus: t('path.coronavirus', '/coronavirus'),
		integration: {
			index: t('path.integration.index', '/intégration'),
			iframe: t('path.integration.iframe', '/iframe'),
			library: t('path.integration.library', '/bibliothèque-de-calcul')
		}
	})
}

export type SitePathsType = ReturnType<typeof constructLocalizedSitePath>

const deepReduce = (fn, initialValue?: any, object?: any) =>
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
