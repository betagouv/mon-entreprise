import { styled } from 'styled-components'

export * from './heading'
export * from './link'
export * from './list'
export * from './paragraphs'

export * as headings from './heading'
export * as lists from './list'
export * as paragraphs from './paragraphs'

export const Strong = styled.strong`
	font-weight: 700;
`

export const U = styled.u`
	text-decoration: underline;
`

export const Code = styled.code`
	background-color: ${({ theme }) =>
		theme.darkMode ? theme.colors.extended.grey[600] : '#eee'};
	color: inherit;
	padding: ${({ theme }) => theme.spacings.xxs};
	border-radius: ${({ theme }) => theme.spacings.xxs};
`

export const Pre = styled.pre`
	overflow: auto;
	padding: 0.5rem;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[300]};
	color: inherit;
	border-radius: 0.25rem;

	& ${Code} {
		overflow: initial;
		padding: 0;
		background-color: initial;
		color: inherit;
		border-radius: initial;
	}
`
