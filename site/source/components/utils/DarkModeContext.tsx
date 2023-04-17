import { ReactNode, createContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import { useDarkMode } from '@/hooks/useDarkMode'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { getItem, setItem } from '@/storage/safeLocalStorage'

// TODO: Theme and dark mode should be in design-system (https://github.com/betagouv/mon-entreprise/issues/2563)

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

		document.body.style.backgroundColor = darkMode ? '#0f172a' : ''

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

export type ThemeType = 'default' | 'light' | 'dark'

export const ForceThemeProvider = ({
	children,
	forceTheme,
}: {
	children: ReactNode
	forceTheme?: ThemeType
}) => {
	const [darkMode] = useDarkMode()

	return (
		<ThemeProvider
			theme={(theme) => ({
				...theme,
				darkMode:
					forceTheme === undefined || forceTheme === 'default'
						? darkMode
						: forceTheme === 'dark',
			})}
		>
			{children}
		</ThemeProvider>
	)
}
