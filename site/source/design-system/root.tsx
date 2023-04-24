import isbot from 'isbot'
import { ReactNode } from 'react'
import styled, {
	StyleSheetManager,
	ThemeProvider,
	css,
} from 'styled-components'

import urssafTheme from '@/design-system/theme'
import { useDarkMode } from '@/hooks/useDarkMode'

type SystemRootProps = {
	children: ReactNode
	forceDarkMode?: boolean
}

const SystemRoot = ({ children, forceDarkMode }: SystemRootProps) => {
	const userAgent = typeof navigator !== 'undefined' && navigator.userAgent
	const [contextDarkMode] = useDarkMode()

	const darkMode =
		typeof forceDarkMode === 'boolean' ? forceDarkMode : contextDarkMode

	return (
		<StyleSheetManager disableCSSOMInjection={isbot(userAgent)}>
			<ThemeProvider theme={{ ...urssafTheme, darkMode }}>
				<BackgroundStyle $darkMode={darkMode}>{children}</BackgroundStyle>
			</ThemeProvider>
		</StyleSheetManager>
	)
}

type BackgroundProps = {
	$darkMode: boolean
}

const BackgroundStyle = styled.div<BackgroundProps>`
	transition: color 0.15s, background-color 0.15s;
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
