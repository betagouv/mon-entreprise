import { createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'
import { theme as ursaafTheme } from 'DesignSystem/theme'
import { ThemeProvider } from 'styled-components'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	const muiTheme = createTheme(createTheme(), ursaafTheme)
	return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
}

export default SystemRoot
