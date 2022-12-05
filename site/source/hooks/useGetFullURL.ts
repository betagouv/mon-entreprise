import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const DEVELOPMENT_BASE_PATHS = {
	fr: '/mon-entreprise',
	en: '/infrance',
}

export const useGetFullURL = () => {
	const { i18n } = useTranslation()
	const { pathname } = useLocation()

	const language = i18n.language as 'fr' | 'en'

	const pathStart = IS_DEVELOPMENT ? DEVELOPMENT_BASE_PATHS[language] : ''

	// Rustine : permet d'utiliser window en SSR
	const originRef = useRef('')
	useEffect(() => {
		originRef.current = window?.location?.origin || ''
	}, [])

	return `${originRef.current}${pathStart}${pathname !== '/' ? pathname : ''}`
}
