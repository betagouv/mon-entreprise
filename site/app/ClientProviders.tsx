'use client'

import { ReactNode } from 'react'

import { DarkModeProvider } from '@/components/utils/DarkModeContext'
import { DesignSystemThemeProvider } from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'

export function ClientProviders({
	children,
	initialDarkMode,
}: {
	children: ReactNode
	initialDarkMode: boolean
}) {
	return (
		<EmbeddedContextProvider>
			<DarkModeProvider initialDarkMode={initialDarkMode}>
				<DesignSystemThemeProvider>{children}</DesignSystemThemeProvider>
			</DarkModeProvider>
		</EmbeddedContextProvider>
	)
}
