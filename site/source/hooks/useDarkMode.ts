import React from 'react'

import {
	DarkModeContext,
	ThemeContext,
} from '@/components/utils/DarkModeContext'

export const useDarkMode = () => {
	const context = React.useContext(DarkModeContext)
	if (context === undefined) {
		throw new Error('useDarkMode must be used within a DarkModeProvider')
	}

	return context
}

export const useTheme = () => {
	const context = React.useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}

	return context
}
