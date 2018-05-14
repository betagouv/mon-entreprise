import i18next from 'i18next'
import queryString from 'query-string'

import { getIframeOption, parseDataAttributes } from './utils'
import enTranslations from './locales/en.yaml'

let lang =
	getIframeOption('lang') ||
	queryString.parse(location.search)['lang'] ||
	parseDataAttributes(sessionStorage['lang']) ||
	'fr'

sessionStorage['lang'] = lang

i18next.init(
	{
		debug: false,
		lng: lang,
		resources: {
			en: {
				translation: enTranslations
			}
		}
	},
	(err, t) => {
		console.log('Error from i18n load', err, t)
	}
)

export default lang
