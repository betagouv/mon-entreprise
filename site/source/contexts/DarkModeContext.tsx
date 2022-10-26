import React from 'react'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

const persistDarkMode = (darkMode: boolean) => {
	localStorage.setItem('darkMode', darkMode.toString())
}

const getDefaultDarkMode = () => {
	if (localStorage.getItem('darkMode')) {
		return localStorage.getItem('darkMode') === 'true'
	}

	if (import.meta.env.DEV && typeof window !== 'undefined') {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	}

	return false
}

export const DarkModeContext = React.createContext<DarkModeContextType>([
	false,
	() => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
])

export const DarkModeProvider: React.FC = ({ children }) => {
	const [darkMode, _setDarkMode] = React.useState<boolean>(getDefaultDarkMode())

	const setDarkMode = (darkMode: boolean) => {
		_setDarkMode(darkMode)
		persistDarkMode(darkMode)

		// https://www.youtube.com/watch?v=Pr8ETbGz35Q
		// eslint-disable-next-line no-console
		console.log(darkMode ? 'Nuit' : 'Jour')
	}

	return (
		<DarkModeContext.Provider value={[darkMode, setDarkMode]}>
			{children}
		</DarkModeContext.Provider>
	)
}
