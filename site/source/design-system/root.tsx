import React from 'react'
import isbot from 'isbot'
import urssafTheme from '@/design-system/theme'
import { ReactNode } from 'react'
import styled, {
	StyleSheetManager,
	ThemeProvider,
	css,
} from 'styled-components'
import { useDarkMode } from '@/hooks/useDarkMode'
import { DarkModeProvider } from '@/contexts/DarkModeContext'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	const userAgent = typeof navigator !== 'undefined' && navigator.userAgent

	return (
		<StyleSheetManager disableCSSOMInjection={isbot(userAgent)}>
			<ThemeProvider theme={urssafTheme}>
				<DarkModeProvider>
					<Background>{children}</Background>
				</DarkModeProvider>
			</ThemeProvider>
		</StyleSheetManager>
	)
}

const Background: React.FC = ({ children }) => {
	const [ darkMode ] = useDarkMode()

	return <BackgroundStyle $darkMode={darkMode}>{children}</BackgroundStyle>
}

type BackgroundProps = {
	$darkMode: boolean
}

const BackgroundStyle = styled.div<BackgroundProps>`
	${({ $darkMode }) => {
		if ($darkMode) {
			return css`
				background-color: ${({ theme }) => theme.colors.extended.dark[800]};
				color: white;
			`
		} else {
			return css`
				background-color: white;
			`
		}
	}}
`

export default SystemRoot
