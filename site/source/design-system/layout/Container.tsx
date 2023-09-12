import { ReactNode, useMemo } from 'react'
import { DefaultTheme, styled, useTheme } from 'styled-components'

import {
	ForceThemeProvider,
	ThemeType,
} from '@/components/utils/DarkModeContext'

const InnerContainer = styled.div`
	margin-right: auto;
	margin-left: auto;
	flex: 1;
	display: flex;
	flex-direction: column;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-left: 16px;
		padding-right: 16px;
		width: 100vw;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-left: 16px;
		padding-right: 16px;
		width: 576px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		padding-left: 24px;
		padding-right: 24px;
		width: 768px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		padding-left: 24px;
		padding-right: 24px;
		width: 992px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		padding-left: 24px;
		padding-right: 24px;
		width: 1200px;
	}

	@media print {
		width: 100%;
		padding: 0;
	}
`

type ContainerProps = {
	children: ReactNode
	forceTheme?: ThemeType
	backgroundColor?: (theme: DefaultTheme) => string
	className?: string
	style?: React.CSSProperties
}

export default function Container({
	backgroundColor,
	forceTheme,
	children,
	className,
	style,
}: ContainerProps) {
	const theme = useTheme()
	const background = useMemo(
		() =>
			backgroundColor?.(theme) ??
			(theme.darkMode
				? theme.colors.extended.dark[800]
				: theme.colors.extended.grey[100]),
		[theme]
	)

	return (
		<ForceThemeProvider forceTheme={forceTheme}>
			<OuterOuterContainer>
				<OuterContainer
					$backgroundColor={background}
					className={className}
					style={style}
				>
					<InnerContainer>{children}</InnerContainer>
				</OuterContainer>
			</OuterOuterContainer>
		</ForceThemeProvider>
	)
}

const OuterContainer = styled.div<{
	$backgroundColor: string
}>`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 100vw;
	background-color: ${({ $backgroundColor }) => $backgroundColor};
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
	flex: 1;
	justify-content: center;
	@media print {
		break-inside: avoid;
	}
`
