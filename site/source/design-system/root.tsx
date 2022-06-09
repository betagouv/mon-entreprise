import urssafTheme from '@/design-system/theme'
import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	return <ThemeProvider theme={urssafTheme}>{children}</ThemeProvider>
}

export default SystemRoot
