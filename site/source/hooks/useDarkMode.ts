import React from 'react'

import { DarkModeContext } from '@/components/utils/DarkModeContext'

export const useDarkMode = () => {
	return React.useContext(DarkModeContext)
}
