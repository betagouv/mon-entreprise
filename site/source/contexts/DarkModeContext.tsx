import React from 'react'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

export const DarkModeContext = React.createContext<DarkModeContextType>([
	false,
	() => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
])

export const DarkModeProvider: React.FC = ({ children }) => {
	const [darkMode, _setDarkMode] = React.useState<boolean>(
		import.meta.env.DEV && typeof window !== 'undefined' ?
			(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) :
			false
	)

	const setDarkMode = (darkMode: boolean) => {
		_setDarkMode(darkMode)

		// https://www.youtube.com/watch?v=Pr8ETbGz35Q
		// eslint-disable-next-line no-console
		console.log(darkMode ? 'Nuit' : 'Jour')
	}

	return (
		<DarkModeContext.Provider value={[ darkMode, setDarkMode ]}>
			{children}
		</DarkModeContext.Provider>
	)
}
