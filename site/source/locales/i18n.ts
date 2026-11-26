import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { unitsResources } from './units'

i18next
	.use(initReactI18next)
	.init({
		returnNull: false,
		resources: unitsResources(),
		react: {
			useSuspense: false,
		},
	})
	// eslint-disable-next-line no-console
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
