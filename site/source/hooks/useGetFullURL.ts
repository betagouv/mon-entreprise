import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useCurrentPath } from '@/lib/navigation'

const DEVELOPMENT_BASE_PATHS = {
	fr: '/mon-entreprise',
	en: '/infrance',
}

export const useGetFullURL = () => {
	const { i18n } = useTranslation()
	const pathname = useCurrentPath()

	const language = i18n.language as 'fr' | 'en'

	const pathStart = IS_DEVELOPMENT ? DEVELOPMENT_BASE_PATHS[language] : ''

	// Rustine : permet d'utiliser window en SSR
	const originRef = useRef('')
	useEffect(() => {
		originRef.current = window?.location?.origin || ''
	}, [])

	return `${originRef.current}${pathStart}${pathname !== '/' ? pathname : ''}`
}
