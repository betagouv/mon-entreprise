import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { isDevelopment } from './../utils'

const DEVELOPMENT_BASE_PATHS = {
	fr: '/mon-entreprise',
	en: '/infrance',
}

export const useGetFullPath = () => {
	const { i18n } = useTranslation()
	const { pathname } = useLocation()

	const language = i18n.language as 'fr' | 'en'

	const pathStart = isDevelopment() ? DEVELOPMENT_BASE_PATHS[language] : '/'

	return `${pathStart}${pathname !== '/' ? pathname : ''}`
}
