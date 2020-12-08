import i18next from 'i18next'
import unitsTranslations from './locales/units.yaml'
import { initReactI18next } from 'react-i18next'

// TODO: This should be moved out of publicodes/core. The only place where this
// is used is to format the units. It should be replaced with a more generic
// `formatUnit` function that the user can provide, cf. #1267.
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
