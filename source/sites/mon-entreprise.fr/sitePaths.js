/* @flow */
import { reduce, toPairs, zipObj } from 'ramda'
import i18n from '../../i18n'
import { constructSitePaths } from '../../utils'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'

export const LANDING_LEGAL_STATUS_LIST: Array<LegalStatus> = [
	'EI',
	'EIRL',
	'EURL',
	'SAS',
	'SARL',
	'SASU',
	'SNC',
	'auto-entrepreneur',
	'auto-entrepreneur-EIRL',
	'SA'
]

const translateTo = language => (str1, str2, options = {}) =>
	i18n.t([str1, str2].filter(Boolean), {
		...(language ? { lng: language } : {}),
		...options
	})
export const constructLocalizedSitePath = (language: string) => {
	const t = translateTo(language)
	return constructSitePaths('', {
		index: '',
		entreprise: {
			index: t('path.entreprise.index', '/entreprise'),
			créer: (companyStatus: LegalStatus | ':status') =>
				companyStatus === ':status'
					? [
						t('path.entreprise.créer', '/créer-une-{{companyStatus}}', {
							companyStatus: ':status'
						}),
						t(
							'path.entreprise.devenirAutoEntrepreneur',
							'/devenir-{{autoEntrepreneur}}',
							{
								autoEntrepreneur: ':status'
							}
						)
					]
					: companyStatus.includes('auto-entrepreneur')
						? t(
							'path.entreprise.devenirAutoEntrepreneur',
							'/devenir-{{autoEntrepreneur}}',
							{
								autoEntrepreneur: companyStatus
							}
						)
						: t('path.entreprise.créer', '/créer-une-{{companyStatus}}', {
							companyStatus
						}),

			après: t('path.entreprise.après', '/après-la-création'),
			statutJuridique: {
				index: t('path.entreprise.statutJuridique.index', '/statut-juridique'),
				liste: t('path.entreprise.statutJuridique.liste', '/liste'),
				soleProprietorship: t(
					'path.entreprise.statutJuridique.responsabilité',
					'/responsabilité'
				),
				directorStatus: t(
					'path.entreprise.statutJuridique.statutDirigeant',
					'/statut-du-dirigeant'
				),
				autoEntrepreneur: t(
					'path.entreprise.statutJuridique.autoEntrepreneur',
					'/auto-entrepreneur-ou-entreprise-individuelle'
				),
				multipleAssociates: t(
					'path.entreprise.statutJuridique.nombreAssociés',
					'/nombre-associés'
				),
				minorityDirector: t(
					'path.entreprise.statutJuridique.gérantMinoritaire',
					'/gérant-majoritaire-ou-minoritaire'
				)
			}
		},
		gérer: {
			index: t('path.gérer.index', '/gérer'),
			embauche: t('path.gérer.embaucher', '/embaucher'),
			selection: t('path.gérer.selection', '/sélection-du-régime'),
			sécuritéSociale: t('path.gérer.selection', '/sécurité-sociale'),
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
			salarié: t('path.simulateurs.salarié', '/salarié')
		},
		économieCollaborative: {
			index: t('path.économieCollaborative.index', '/économie-collaborative'),
			votreSituation: t(
				'path.économieCollaborative.votreSituation',
				'/votre-situation'
			)
		},
		documentation: {
			exemples: t('path.documentation.exemples', '/exemples'),
			index: t('path.documentation.index', '/documentation')
		},
		integration: {
			index: t('path.integration.index', '/intégration'),
			iframe: t('path.integration.iframe', '/iframe'),
			library: t('path.integration.library', '/bibliothèque-de-calcul')
		}
	})
}

const deepReduce = (fn, initialValue, object: Object) =>
	reduce(
		(acc, [key, value]) =>
			typeof value === 'object'
				? deepReduce(fn, acc, value)
				: fn(acc, value, key),
		initialValue,
		toPairs(object)
	)

export const generateSiteMap = (sitePaths: Object) =>
	deepReduce(
		(paths, path, key) => [
			...paths,
			...(typeof path === 'function' && key === 'créer'
				? LANDING_LEGAL_STATUS_LIST.map(path)
				: [path])
		],
		[],
		sitePaths
	)

type LangLink = Array<{ href: string, hrefLang: 'fr' | 'en' }>
type SiteMap = Array<string>
const enSiteMap: SiteMap = generateSiteMap(
	constructLocalizedSitePath('en')
).map(path => (process.env.EN_SITE || '').replace('${path}', path))
const frSiteMap: SiteMap = generateSiteMap(
	constructLocalizedSitePath('fr')
).map(path => (process.env.FR_SITE || '').replace('${path}', path))

export const hrefLangLink = {
	en: zipObj<string, LangLink>(
		enSiteMap,
		frSiteMap.map(href => [{ href, hrefLang: 'fr' }])
	),
	fr: zipObj<string, LangLink>(
		frSiteMap,
		enSiteMap.map(href => [{ href, hrefLang: 'en' }])
	)
}
