import 'server-only'

import i18next from 'i18next'

import { baseI18nConfig, parseLangue } from './i18nResources'

export const langue = parseLangue(process.env.LANGUE)

i18next
	.init(baseI18nConfig(langue))
	// eslint-disable-next-line no-console
	.catch((err) => console.error('Erreur init i18next server:', err))

export default i18next
