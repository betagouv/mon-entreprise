import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import { getItem, setItem } from '@/storage/safeLocalStorage'
import React, { useEffect } from 'react'

type DarkModeContextType = [boolean, (darkMode: boolean) => void]

const persistDarkMode = (darkMode: boolean) => {
	setItem('darkMode', darkMode.toString())
}

const getDefaultDarkMode = () => {
	if (import.meta.env.SSR) {
		return false
	}

	return getItem('darkMode')
		? getItem('darkMode') === 'true'
		: matchMedia?.('(prefers-color-scheme: dark)').matches
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

	useEffect(() => {
		if (!window.matchMedia) {
			return
		}
		const onDarkModeChange = (e: MediaQueryListEvent) => {
			setDarkMode(e.matches)
		}
		const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

		// safari 13 doesn't have addEventListener
		matchDarkMode.addEventListener
			? matchDarkMode.addEventListener('change', onDarkModeChange)
			: matchDarkMode.addListener(onDarkModeChange)

		return () => {
			// safari 13 doesn't have removeEventListener
			matchDarkMode.removeEventListener
				? matchDarkMode.removeEventListener('change', onDarkModeChange)
				: matchDarkMode.removeListener(onDarkModeChange)
		}
	})

	return (
		<DarkModeContext.Provider
			value={[!useIsEmbedded() && darkMode, setDarkMode]}
		>
			{children}
		</DarkModeContext.Provider>
	)
}
