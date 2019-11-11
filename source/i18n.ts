import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.yaml'
import unitsTranslations from './locales/units.yaml'
import { getSessionStorage } from './utils'

export type AvailableLangs = 'fr' | 'en'

let lang =
	(typeof document !== 'undefined' &&
		new URLSearchParams(document.location.search.substring(1)).get('lang')) ||
	getSessionStorage()
		?.getItem('lang')
		?.match(/^(fr|en)$/)?.[0] ||
	'fr'

getSessionStorage()?.setItem('lang', lang)
i18next
	.use(initReactI18next)
	.init({
		lng: lang,
		resources: {
			fr: { units: unitsTranslations.fr },
			en: {
				translation: enTranslations,
				units: unitsTranslations.en
			}
		}
	})
	.catch(err => console?.error('Error from i18n load', err))

export default i18next
