/* @flow */
import { reduce, toPairs, zipObj } from 'ramda';
import i18n from '../../i18n';
import { constructSitePaths } from '../../utils';
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
				companyStatus === ':status'
					? [t('path.entreprise.créer', '/créer-une-{{companyStatus}}',{
							companyStatus: ':status'
					  }), t(
							'path.entreprise.devenirAutoEntrepreneur',
							'/devenir-{{autoEntrepreneur}}',
							{
								autoEntrepreneur: ':status'
							}
					  )]
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

			trouver: t('path.entreprise.trouver', '/retrouver-votre-entreprise'),
			après: t('path.entreprise.après', '/après-la-création'),
			statutJuridique: {
				index: t('path.entreprise.statutJuridique.index', '/statut-juridique'),
				liste: t('path.entreprise.statutJuridique.liste', '/liste'),
				liability: t(
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
		sécuritéSociale: {
			index: t('path.sécuritéSociale.index', '/sécurité-sociale'),
			'assimilé-salarié': t(
				'path.sécuritéSociale.assimilé-salarié',
				'/assimilé-salarié'
			),
			indépendant: t('path.sécuritéSociale.indépendant', '/indépendant'),
			'auto-entrepreneur': t(
				'path.sécuritéSociale.auto-entrepreneur',
				'/auto-entrepreneur'
			),
			comparaison: t(
				'path.sécuritéSociale.comparaison',
				'/comparaison-assimilé-salarié-indépendant-et-auto-entrepreneur'
			),
			salarié: t('path.sécuritéSociale.salarié', '/salarié')
		},
		démarcheEmbauche: {
			index: t('path.démarcheEmbauche.index', '/démarches-embauche')
		},
		documentation: {
			index: t('path.documentation.index', '/documentation')
		}
	})
}

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

type LangLink = Array<{ href: string, hrefLang: 'fr' | 'en'}>
type SiteMap = Array<string>
const enSiteMap:SiteMap = generateSiteMap(constructLocalizedSitePath('en')).map(path =>
	(process.env.EN_SITE || '').replace('${path}', path)
)
const frSiteMap:SiteMap = generateSiteMap(constructLocalizedSitePath('fr')).map(path =>
	(process.env.FR_SITE || '').replace('${path}', path)
)

export const hrefLangLink = {
	en: zipObj<string, LangLink>(enSiteMap, frSiteMap.map(href => [{ href, hrefLang: 'fr' }])),
	fr: zipObj<string, LangLink>(frSiteMap, enSiteMap.map(href => [{ href, hrefLang: 'en' }]))
}
