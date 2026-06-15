import { ReactNode } from 'react'
import { I18nProvider, OverlayProvider } from 'react-aria'
import { css, styled, ThemeProvider } from 'styled-components'

import { useDarkMode } from '@/hooks/useDarkMode'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'

import { GlobalStyle } from './global-style'
import { theme as urssafTheme } from './theme'

type SystemRootProps = {
	children: ReactNode
	forceDarkMode?: boolean
}

const SystemRoot = ({ children, forceDarkMode }: SystemRootProps) => {
	const [contextDarkMode] = useDarkMode()
	const isInIframe = useIsEmbedded()

	const darkMode =
		typeof forceDarkMode === 'boolean' ? forceDarkMode : contextDarkMode

	return (
		<I18nProvider locale="fr-FR">
			<ThemeProvider theme={{ ...urssafTheme, darkMode, isInIframe }}>
				<OverlayProvider>
					<BackgroundStyle $darkMode={darkMode}>
						<GlobalStyle />
						{children}
					</BackgroundStyle>
				</OverlayProvider>
			</ThemeProvider>
		</I18nProvider>
	)
}

type BackgroundProps = {
	$darkMode: boolean
}

const BackgroundStyle = styled.div<BackgroundProps>`
	transition:
		color 0.15s,
		background-color 0.15s;
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
export { SystemRoot as DesignSystemThemeProvider }
