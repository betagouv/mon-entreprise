import { useTranslation } from 'react-i18next'

import { AvailableLang, parseLangue } from '@/locales/langue'
import { absoluteSitePaths, relativeSitePaths } from '@/sitePaths'

/**
 * Le hook vit à part de la table des chemins (`@/sitePaths`) pour que celle-ci
 * reste utilisable hors de React : les Server Components de Next ne peuvent pas
 * charger un module qui dépend de react-i18next.
 */
export const useSitePaths = <T extends AvailableLang>(lang?: T) => {
	const { language } = useTranslation().i18n
	lang ??= parseLangue(language) as T

	return {
		relativeSitePaths: relativeSitePaths[lang],
		absoluteSitePaths: absoluteSitePaths[lang],
	}
}
