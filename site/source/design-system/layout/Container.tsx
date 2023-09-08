import { ReactNode } from 'react'
import { DefaultTheme, styled } from 'styled-components'

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

type OuterContainerProps = {
	$backgroundColor?: (theme: DefaultTheme) => string
}

type ContainerProps = {
	children: ReactNode
	forceTheme?: ThemeType
	backgroundColor?: (theme: DefaultTheme) => string
	className?: string
}

export default function Container({
	backgroundColor,
	forceTheme,
	children,
	className,
}: ContainerProps) {
	return (
		<ForceThemeProvider forceTheme={forceTheme}>
			<OuterOuterContainer>
				<OuterContainer
					$backgroundColor={backgroundColor}
					className={className}
				>
					<InnerContainer>{children}</InnerContainer>
				</OuterContainer>
			</OuterOuterContainer>
		</ForceThemeProvider>
	)
}

const OuterContainer = styled.div<OuterContainerProps>`
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 100vw;
	background-color: ${({ theme, $backgroundColor }) =>
		$backgroundColor
			? $backgroundColor(theme)
			: theme.colors.extended.grey[100]};
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
