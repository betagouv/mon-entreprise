import { createContext, ReactNode, useEffect, useState } from 'react'
import { ThemeProvider, useTheme } from 'styled-components'

import { useDarkMode } from '@/hooks/useDarkMode'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { getItem, setItem } from '@/storage/safeLocalStorage'

// TODO: Theme and dark mode should be in design-system (https://github.com/betagouv/mon-entreprise/issues/2563)

export type ThemeType = 'light' | 'dark' | 'system'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

type ThemeContextType = {
	theme: ThemeType
	setTheme: (theme: ThemeType) => void
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'system',
	setTheme: () => {
		// eslint-disable-next-line no-console
		console.error('No theme provider found')
	},
})

const persistTheme = (theme: ThemeType) => {
	setItem('theme', theme)
}

const getDefaultTheme = (): ThemeType => {
	if (import.meta.env.SSR) {
		return 'system'
	}
	const savedTheme = getItem('theme') as ThemeType
	return savedTheme || 'system'
}

export const DarkModeContext = createContext<DarkModeContextType>([
	false,
	() => {
		// eslint-disable-next-line no-console
		console.error('No dark mode provider found')
	},
])

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, _setTheme] = useState<ThemeType>(getDefaultTheme())
	const [systemDarkMode, setSystemDarkMode] = useState<boolean>(() => {
		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
		}
		return false
	})

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		// Ensure state is synced in case it changed between init and effect
		setSystemDarkMode(mediaQuery.matches)

		const handler = (e: MediaQueryListEvent) => setSystemDarkMode(e.matches)
		mediaQuery.addEventListener('change', handler)
		return () => mediaQuery.removeEventListener('change', handler)
	}, [])

	const setTheme = (newTheme: ThemeType) => {
		_setTheme(newTheme)
		persistTheme(newTheme)
	}

	const isDarkMode =
		theme === 'system' ? systemDarkMode : theme === 'dark'

	useEffect(() => {
		document.body.style.backgroundColor = isDarkMode ? '#0f172a' : ''
		// eslint-disable-next-line no-console
		console.log(isDarkMode ? 'Nuit' : 'Jour')
	}, [isDarkMode])

	const finalDarkMode = !useIsEmbedded() && isDarkMode

	// Legacy setter for backward compatibility
	const setDarkModeLegacy = (value: boolean) => {
		setTheme(value ? 'dark' : 'light')
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<DarkModeContext.Provider value={[finalDarkMode, setDarkModeLegacy]}>
				{children}
			</DarkModeContext.Provider>
		</ThemeContext.Provider>
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
	const currentTheme = useTheme()

	return (
		<ThemeProvider
			theme={{
				...currentTheme,
				darkMode:
					forceTheme === undefined || forceTheme === 'default'
						? darkMode
						: forceTheme === 'dark',
			}}
		>
			{children}
		</ThemeProvider>
	)
}
