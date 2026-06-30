import { useTranslation } from 'react-i18next'

import { environnement } from '@/services/environnement/environnement'

export const useSiteUrl = () => {
	const language = useTranslation().i18n.language

	return language === 'fr' ? environnement.urls.fr : environnement.urls.en
}
