import { useIsEmbedded } from '@/components/utils/embeddedContext'
import React, { useEffect } from 'react'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

const persistDarkMode = (darkMode: boolean) => {
	localStorage.setItem('darkMode', darkMode.toString())
}

const useDefaultDarkMode = () => {
	const isEmbeded = useIsEmbedded()

	if (isEmbeded) {
		return false
	}
	if (localStorage.getItem('darkMode')) {
		return localStorage.getItem('darkMode') === 'true'
	}

	return (
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	)
}

export const DarkModeContext = React.createContext<DarkModeContextType>([
	false,
	() => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
])

export const DarkModeProvider: React.FC = ({ children }) => {
	const [darkMode, _setDarkMode] = React.useState<boolean>(useDefaultDarkMode())

	const setDarkMode = (darkMode: boolean) => {
		_setDarkMode(darkMode)
		persistDarkMode(darkMode)

		// https://www.youtube.com/watch?v=Pr8ETbGz35Q
		// eslint-disable-next-line no-console
		console.log(darkMode ? 'Nuit' : 'Jour')
	}

	useEffect(() => {
		if (!window.matchMedia) {
			return
		}
		const onDarkModeChange = (e: MediaQueryListEvent) => {
			setDarkMode(e.matches)
		}
		const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
		matchDarkMode.addEventListener('change', onDarkModeChange)

		return () => matchDarkMode.removeEventListener('change', onDarkModeChange)
	})

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			{children}
		</DarkModeContext.Provider>
	)
}
