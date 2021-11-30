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

const OuterContainer = styled.div<OuterContainerProps>`
	background-color: ${({ theme, backgroundColor }) =>
		backgroundColor ? backgroundColor(theme) : theme.colors};
	${InnerContainer} & {

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		margin-left: -16px;
		margin-right: -16px;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		--maxWidth: ${({ theme }) => theme.breakpointsWidth.sm}
		--margin: calc(100vw - 16px - var(---maxWidth) / 2 )
		margin-left: var(--margin);
		margin-right: var(--margin);
		max-width: var(--maxWidth);
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		--maxWidth: ${({ theme }) => theme.breakpointsWidth.md}
		--margin: calc(100vw - 24px - var(---maxWidth) / 2 )
		margin-left: var(--margin);
		margin-right: var(--margin);
		max-width: var(--maxWidth);
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		--maxWidth: ${({ theme }) => theme.breakpointsWidth.lg}
		--margin: calc(100vw - 24px - var(---maxWidth) / 2 )
		margin-left: var(--margin);
		margin-right: var(--margin);
		max-width: var(--maxWidth);
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		--maxWidth: ${({ theme }) => theme.breakpointsWidth.xl}
		--margin: calc(100vw - 24px - var(---maxWidth) / 2 )
		margin-left: var(--margin);
		margin-right: var(--margin);
		max-width: var(--maxWidth);
	}

	@media print {
		max-width: 100%;
		padding: 0;
	}
}
`
