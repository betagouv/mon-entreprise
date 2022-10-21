import React from 'react'
import { DarkModeContext } from '@/contexts/DarkModeContext'

export const useDarkMode = () => {
	return React.useContext(DarkModeContext)
}
