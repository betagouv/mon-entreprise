import i18next, { type i18n } from 'i18next'

import { declareLanguage } from '@/services/applicationLanguage'

import { baseI18nConfig, type TranslationCatalog } from './i18nResources'
import { AvailableLang } from './langue'

type I18nextPlugin = Parameters<i18n['use']>[0]

type Bootstrap = {
	catalog?: TranslationCatalog
	plugins?: I18nextPlugin[]
}

const configure = (
	instance: i18n,
	language: AvailableLang,
	{ catalog, plugins = [] }: Bootstrap
): i18n => {
	plugins.forEach((plugin) => instance.use(plugin))

	instance
		.init({
			...baseI18nConfig(language, catalog),
			react: { useSuspense: false },
		})
		.catch((err) =>
			// eslint-disable-next-line no-console
			console.error('Erreur init i18next :', err)
		)

	return instance
}

export const setAppLanguage = (
	language: AvailableLang,
	{ catalog, plugins = [] }: Bootstrap = {}
): i18n => {
	declareLanguage(language)

	if (!i18next.isInitialized) {
		return configure(i18next, language, { catalog, plugins })
	}

	plugins.forEach((plugin) => i18next.use(plugin))

	if (catalog) {
		i18next.addResourceBundle(language, 'translation', catalog, true, true)
	}

	i18next.changeLanguage(language).catch((err) =>
		// eslint-disable-next-line no-console
		console.error('Erreur changement de langue i18next :', err)
	)

	return i18next
}

export const createIsolatedI18n = (
	language: AvailableLang,
	bootstrap: Bootstrap = {}
): i18n => configure(i18next.createInstance(), language, bootstrap)
