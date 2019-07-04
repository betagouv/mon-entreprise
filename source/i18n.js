import i18next from 'i18next'
import queryString from 'query-string'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.yaml'
import {
	getFromSessionStorage,
	getIframeOption,
	parseDataAttributes,
	setToSessionStorage
} from './utils'

let lang =
	getIframeOption('lang') ||
	queryString.parse(location.search)['lang'] ||
	parseDataAttributes(getFromSessionStorage('lang')) ||
	'fr'

setToSessionStorage('lang', lang)
i18next.use(initReactI18next).init(
	{
		lng: lang,
		resources: {
			en: {
				translation: enTranslations
			}
		}
	},
	(err, t) => {
		console && console.error('Error from i18n load', err, t) //eslint-disable-line no-console
	}
)

export default i18next
