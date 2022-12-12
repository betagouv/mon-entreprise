import isbot from 'isbot'
import { ReactNode } from 'react'
import styled, {
	StyleSheetManager,
	ThemeProvider,
	css,
} from 'styled-components'

import urssafTheme, { getThemeColorsValues } from '@/design-system/theme'
import { useDarkMode } from '@/hooks/useDarkMode'

type SystemRootProps = {
	children: ReactNode
}

const SystemRoot = ({ children }: SystemRootProps) => {
	const userAgent = typeof navigator !== 'undefined' && navigator.userAgent

	const [isDarkMode] = useDarkMode()

	const darkModeColorValues = getThemeColorsValues(isDarkMode)

	return (
		<StyleSheetManager disableCSSOMInjection={isbot(userAgent)}>
			<ThemeProvider
				theme={{
					...urssafTheme,
					colors: {
						...urssafTheme.colors,
						...darkModeColorValues,
					},
				}}
			>
				<Background>{children}</Background>
			</ThemeProvider>
		</StyleSheetManager>
	)
}

const Background = ({ children }: { children: ReactNode }) => {
	const [darkMode] = useDarkMode()

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
