import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import unitsTranslations from './units.yaml'

export type AvailableLangs = 'fr' | 'en'

interface Units {
	fr: Record<string, string>
	en: Record<string, string>
}

i18next
	.use(initReactI18next)
	.init({
		returnNull: false,
		resources: {
			fr: { units: (unitsTranslations as Units).fr },
			en: { units: (unitsTranslations as Units).en },
		},
		react: {
			useSuspense: false,
		},
	})
	// eslint-disable-next-line no-console
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
