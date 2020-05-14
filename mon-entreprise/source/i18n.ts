import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

export type AvailableLangs = 'fr' | 'en'

i18next
	.use(initReactI18next)
	.init({
		react: {
			useSuspense: false
		}
	})
	.catch(err => console?.error('Error from i18n load', err))

export default i18next
