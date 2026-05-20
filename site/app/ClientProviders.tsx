'use client'

import { ReactNode } from 'react'

import { DarkModeProvider } from '@/components/utils/DarkModeContext'
import { DesignSystemThemeProvider } from '@/design-system'
import StyledComponentsRegistry from '@/design-system/StyledComponentsRegistry'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'
import { NextJsNavigationProvider } from '@/lib/navigation/providers/NextJsNavigationProvider'

export function ClientProviders({
	children,
	initialDarkMode,
}: {
	children: ReactNode
	initialDarkMode: boolean
}) {
	return (
		<StyledComponentsRegistry>
			<NextJsNavigationProvider>
				<EmbeddedContextProvider>
					<DarkModeProvider initialDarkMode={initialDarkMode}>
						<DesignSystemThemeProvider>{children}</DesignSystemThemeProvider>
					</DarkModeProvider>
				</EmbeddedContextProvider>
			</NextJsNavigationProvider>
		</StyledComponentsRegistry>
	)
}
