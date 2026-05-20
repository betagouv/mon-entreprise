'use client'

import { Body, Button, H1 } from '@/design-system'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function Home() {
	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<main>
			<H1>Mon entreprise — Next.js</H1>
			<Body>
				Migration en cours. Cette page confirme que Next.js et le design-system
				sont correctement configurés.
			</Body>
			<Button onPress={() => setDarkMode(!darkMode)}>
				Basculer en mode {darkMode ? 'light' : 'dark'}
			</Button>
		</main>
	)
}
