'use client'

import { useContext } from 'react'

import { NavigationAPI } from './NavigationAPI'
import { NavigationContext } from './NavigationContext'

export function useNavigation(): NavigationAPI {
	const context = useContext(NavigationContext)

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider')
	}

	return context
}
