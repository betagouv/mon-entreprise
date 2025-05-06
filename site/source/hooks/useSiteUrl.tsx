import { useTranslation } from 'react-i18next'

export const useSiteUrl = () => {
	const language = useTranslation().i18n.language

	return language === 'fr'
		? import.meta.env.VITE_FR_BASE_URL
		: import.meta.env.VITE_EN_BASE_URL
}
