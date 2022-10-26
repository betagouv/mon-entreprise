import { ReactNode } from 'react'
import styled, { DefaultTheme, ThemeProvider } from 'styled-components'
import { useDarkMode } from '@/hooks/useDarkMode'

const InnerContainer = styled.div`
	margin-right: auto;
	margin-left: auto;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-left: 16px;
		padding-right: 16px;
		max-width: 100vw;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-left: 16px;
		padding-right: 16px;
		max-width: 576px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 768px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 992px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 1200px;
	}

	@media print {
		max-width: 100%;
		padding: 0;
	}
`

type OuterContainerProps = {
	backgroundColor?: (theme: DefaultTheme) => string
}

type ContainerProps = {
	children: ReactNode
	darkMode?: boolean
	backgroundColor?: (theme: DefaultTheme) => string
}

export default function Container({
	backgroundColor,
	children,
}: ContainerProps) {
	const { darkMode } = useDarkMode()

	return (
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode })}>
			<OuterOuterContainer>
				<OuterContainer backgroundColor={backgroundColor}>
					<InnerContainer>{children}</InnerContainer>
				</OuterContainer>
			</OuterOuterContainer>
		</ThemeProvider>
	)
}

const OuterContainer = styled.div<OuterContainerProps>`
	flex: 1;
	min-width: 100vw;
	background-color: ${({ theme, backgroundColor }) =>
		backgroundColor ? backgroundColor(theme) : theme.colors};
	@media print {
		min-width: initial;
	}
	${InnerContainer} & {
		@media print {
			margin-left: 0;
			margin-right: 0;
			padding: 0.5em;
		}
	}
`

const OuterOuterContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	@media print {
		break-inside: avoid;
	}
`
