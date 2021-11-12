import { ReactNode } from 'react'
import styled, { DefaultTheme } from 'styled-components'

const InnerContainer = styled.div`
	margin-right: auto;
	margin-left: auto;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		padding-left: 16px;
		padding-right: 16px;
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
`

type OuterContainerProps = {
	backgroundColor?: (theme: DefaultTheme) => string
}

const OuterContainer = styled.div<OuterContainerProps>`
	width: 100%;
	background-color: ${({ theme, backgroundColor }) =>
		backgroundColor ? backgroundColor(theme) : theme.colors};
`

type ContainerProps = {
	children: ReactNode
	backgroundColor?: (theme: DefaultTheme) => string
}
export default function Container({
	backgroundColor,
	children,
}: ContainerProps) {
	return (
		<OuterContainer backgroundColor={backgroundColor}>
			<InnerContainer>{children}</InnerContainer>
		</OuterContainer>
	)
}
