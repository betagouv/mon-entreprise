/* @flow */
import { map, reduce, toPairs, zipObj } from 'ramda'
import i18n from '../../i18n'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'

export const LANDING_LEGAL_STATUS_LIST: Array<LegalStatus> = [
	'EI',
	'EIRL',
	'EURL',
	'SAS',
	'SARL',
	'SASU',
	'SNC',
	'micro-entreprise',
	'micro-entreprise-EIRL',
	'SA'
]

const translateTo = language => (str1, str2, options = {}) =>
	i18n.t([str1, str2].filter(Boolean), {
		...(language ? { lng: language } : {}),
		...options
	})
const constructLocalizedSitePath = language => {
	const t = translateTo(language)
	return constructSitePaths('', {
		index: '',
		entreprise: {
			index: t('path.entreprise.index', '/entreprise'),
			votreEntreprise: t(
				'path.entreprise.votreEntreprise',
				'/votre-entreprise'
			),
			créer: (companyStatus: LegalStatus | ':status') =>
				t('path.entreprise.créer', '/créer-une-{{companyStatus}}', {
					companyStatus:
						companyStatus === ':status' ? ':status' : t(companyStatus)
				}),
			trouver: t('path.entreprise.trouver', '/retrouver-votre-entreprise'),
			après: t('path.entreprise.après', '/après-la-création'),
			statusJuridique: {
				index: t('path.entreprise.statusJuridique.index', '/status-juridique'),
				liste: t('path.entreprise.statusJuridique.liste', '/liste'),
				liability: t(
					'path.entreprise.statusJuridique.responsabilité',
					'/responsabilité'
				),
				directorStatus: t(
					'path.entreprise.statusJuridique.statusDirigeant',
					'/status-du-dirigeant'
				),
				microEnterprise: t(
					'path.entreprise.statusJuridique.microEntreprise',
					'/micro-entreprise-ou-entreprise-individuelle'
				),
				multipleAssociates: t(
					'path.entreprise.statusJuridique.nombreAssociés',
					'/nombre-associés'
				),
				minorityDirector: t(
					'path.entreprise.statusJuridique.gérantMinoritaire',
					'/gérant-majoritaire-ou-minoritaire'
				)
			}
		},
		sécuritéSociale: {
			index: t('path.sécuritéSociale.index', '/sécurité-sociale'),
			'assimilé-salarié': t(
				'path.sécuritéSociale.assimilé-salarié',
				'/assimilé-salarié'
			),
			indépendant: t('path.sécuritéSociale.indépendant', '/indépendant'),
			'micro-entreprise': t(
				'path.sécuritéSociale.micro-entreprise',
				'/micro-entreprise'
			),
			comparaison: t(
				'path.sécuritéSociale.comparaison',
				'/comparaison-assimilé-salarié-indépendant-et-micro-entreprise'
			),
			salarié: t('path.sécuritéSociale.salarié', '/salarié')
		},
		démarcheEmbauche: {
			index: t('path.démarcheEmbauche.index', '/démarches-embauche')
		}
	})
}
const constructSitePaths = (
	root: string,
	{ index, ...sitePaths }: { index: string }
) => ({
	index: root + index,
	...map(
		value =>
			typeof value === 'string'
				? root + index + value
				: typeof value === 'function'
				? (...args) => root + index + value(...args)
				: constructSitePaths(root + index, value),
		sitePaths
	)
})

let sitePath = constructLocalizedSitePath()
i18n.on('languageChanged', () => {
	sitePath = constructLocalizedSitePath()
})

export default () => sitePath
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

const enSiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(path =>
	(process.env.EN_SITE || '').replace('${path}', path)
)
const frSiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(path =>
	(process.env.FR_SITE || '').replace('${path}', path)
)

export const hrefLangLink = {
	en: zipObj(enSiteMap, frSiteMap.map(href => [{ href, hrefLang: 'fr' }])),
	fr: zipObj(frSiteMap, enSiteMap.map(href => [{ href, hrefLang: 'en' }]))
}
