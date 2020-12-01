import i18next from 'i18next'
import unitsTranslations from './locales/units.yaml'
import { initReactI18next } from 'react-i18next'

i18next
	.use(initReactI18next)

	.init({
		resources: {
			fr: { units: unitsTranslations.fr },
			en: { units: unitsTranslations.en },
		},
	})
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
