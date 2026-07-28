import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@/lib/navigation'
import { AvailableLang, parseLangue } from '@/locales/langue'

const DEVELOPMENT_BASE_PATHS: Record<AvailableLang, string> = {
	fr: '/mon-entreprise',
	en: '/infrance',
}

export const useGetFullURL = () => {
	const { i18n } = useTranslation()
	const { currentPath } = useNavigation()

	const language = parseLangue(i18n.language)

	const isViteDevelopment =
		typeof IS_DEVELOPMENT !== 'undefined' && IS_DEVELOPMENT

	const pathStart = isViteDevelopment ? DEVELOPMENT_BASE_PATHS[language] : ''

	// Rustine : permet d'utiliser window en SSR
	const originRef = useRef('')
	useEffect(() => {
		originRef.current = window?.location?.origin || ''
	}, [])

	return `${originRef.current}${pathStart}${
		currentPath !== '/' ? currentPath : ''
	}`
}
