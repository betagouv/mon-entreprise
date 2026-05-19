'use client'

import { ReactNode } from 'react'

import { DesignSystemThemeProvider } from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'

export function Providers({ children }: { children: ReactNode }) {
	return (
		<EmbeddedContextProvider>
			<DesignSystemThemeProvider>{children}</DesignSystemThemeProvider>
		</EmbeddedContextProvider>
	)
}
