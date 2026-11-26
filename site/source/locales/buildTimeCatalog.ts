import type { TranslationCatalog } from './i18nResources'
import catalog from './ui-en.yaml'

export const buildTimeCatalog: TranslationCatalog | undefined =
	process.env.LANGUE === 'en' ? (catalog as TranslationCatalog) : undefined
