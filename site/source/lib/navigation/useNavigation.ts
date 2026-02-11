'use client'

import { useContext } from 'react'

import { NavigationContext } from './NavigationContext'
import { NavigationAPI } from './NavigationAPI'

export function useNavigation(): NavigationAPI {
	const context = useContext(NavigationContext)

	if (!context) {
		throw new Error('useNavigation must be used within a NavigationProvider')
	}

	return context
}
