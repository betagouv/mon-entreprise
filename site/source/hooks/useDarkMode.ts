import React from 'react'

import {
	DarkModeContext,
	ThemeContext,
} from '@/components/utils/DarkModeContext'

export const useDarkMode = () => {
	return React.useContext(DarkModeContext)
}

export const useTheme = () => {
	const context = React.useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}