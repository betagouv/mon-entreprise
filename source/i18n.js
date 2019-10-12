import i18next from 'i18next'
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
	new URLSearchParams(document.location.search.substring(1)).get('lang') ||
	parseDataAttributes(getFromSessionStorage('lang')) ||
	'fr'

setToSessionStorage('lang', lang)
i18next
	.use(initReactI18next)
	.init({
		lng: lang,
		resources: {
			en: {
				translation: enTranslations
			}
		}
	})
	.catch(err => console?.error('Error from i18n load', err))

export default i18next
