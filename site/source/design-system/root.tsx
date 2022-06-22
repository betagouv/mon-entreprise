import { theme as urssafTheme } from '@/design-system/theme'
import isbot from 'isbot'
import { ReactNode } from 'react'
import { StyleSheetManager, ThemeProvider } from 'styled-components'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	const userAgent = typeof navigator !== 'undefined' && navigator.userAgent

	return (
		<StyleSheetManager disableCSSOMInjection={isbot(userAgent)}>
			<ThemeProvider theme={urssafTheme}>{children}</ThemeProvider>
		</StyleSheetManager>
	)
}

export default SystemRoot
