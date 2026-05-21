'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import { AvailableLang, baseI18nConfig } from './i18nResources'

export function createI18nClient(langue: AvailableLang) {
	const instance = i18next.createInstance()
	instance
		.use(initReactI18next)
		.init({
			...baseI18nConfig(langue),
			react: { useSuspense: false },
		})
		.catch((err) =>
			// eslint-disable-next-line no-console
			console.error('Erreur init i18next client:', err)
		)

	return instance
}
