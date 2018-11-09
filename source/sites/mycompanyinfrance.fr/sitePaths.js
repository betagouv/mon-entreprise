/* @flow */
import { map } from 'ramda'
import i18n from '../../i18n'
const constructLocalizedSitePath = () =>
	constructSitePaths('', {
		index: '',
		entreprise: {
			index: i18n.t('path.entreprise.index', '/entreprise'),
			monEntreprise: i18n.t('path.entreprise.monEntreprise', '/mon-entreprise'),
			créer: (companyStatus: string) =>
				i18n.t(['path.entreprise.créer', '/créer-une-{{companyStatus}}'], {
					companyStatus
				}),
			trouver: i18n.t('path.entreprise.trouver', '/retrouver-mon-entreprise'),
			après: i18n.t('path.entreprise.après', '/après-la-création'),
			statusJuridique: {
				index: i18n.t(
					'path.entreprise.statusJuridique.index',
					'/status-juridique'
				),
				liste: i18n.t('path.entreprise.statusJuridique.liste', '/liste'),
				liability: i18n.t(
					'path.entreprise.statusJuridique.responsabilité',
					'/responsabilité'
				),
				directorStatus: i18n.t(
					'path.entreprise.statusJuridique.statusDirigeant',
					'/status-du-dirigeant'
				),
				microEnterprise: i18n.t(
					'path.entreprise.statusJuridique.microEntreprise',
					'/micro-entreprise-ou-entreprise-individuelle'
				),
				multipleAssociates: i18n.t(
					'path.entreprise.statusJuridique.nombreAssociés',
					'/nombre-associés'
				),
				minorityDirector: i18n.t(
					'path.entreprise.statusJuridique.gérantMinoritaire',
					'/gérant-majoritaire-ou-minoritaire'
				)
			}
		},
		sécuritéSociale: {
			index: i18n.t('path.sécuritéSociale', '/sécurité-sociale'),
			simulation: '/simulation'
		},
		démarcheEmbauche: {
			index: i18n.t('path.démarcheEmbauche', '/démarches-embauche')
		}
	})

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
