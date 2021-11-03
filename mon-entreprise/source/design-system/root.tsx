import { ReactNode } from 'react'
import { theme as ursaafTheme } from 'DesignSystem/theme'
import { ThemeProvider } from 'styled-components'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	return <ThemeProvider theme={ursaafTheme}>{children}</ThemeProvider>
}

export default SystemRoot
