import { ReactNode, createContext, useState } from 'react'

import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import { getItem, setItem } from '@/storage/safeLocalStorage'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

const persistDarkMode = (darkMode: boolean) => {
	setItem('darkMode', darkMode.toString())
}

const getDefaultDarkMode = () => {
	if (import.meta.env.SSR) {
		return false
	}

	return getItem('darkMode') ? getItem('darkMode') === 'true' : false
}

export const DarkModeContext = createContext<DarkModeContextType>([
	false,
	() => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
])

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
	const [darkMode, _setDarkMode] = useState<boolean>(getDefaultDarkMode())

	const setDarkMode = (darkMode: boolean) => {
		_setDarkMode(darkMode)
		persistDarkMode(darkMode)

		// https://www.youtube.com/watch?v=Pr8ETbGz35Q
		// eslint-disable-next-line no-console
		console.log(darkMode ? 'Nuit' : 'Jour')
	}

	const finalDarkMode = !useIsEmbedded() && darkMode

	return (
		<DarkModeContext.Provider value={[finalDarkMode, setDarkMode]}>
			{children}
		</DarkModeContext.Provider>
	)
}
