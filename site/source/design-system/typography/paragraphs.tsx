import styled, { css } from 'styled-components'

import { CustomizeBlockStyle } from '../global-style'

export const baseParagraphStyle = css`
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	color: ${({ theme }) => theme.colors.extended.grey[800]};
	background-color: inherit;

	@media not print {
		color: ${({ theme }) =>
			theme.darkMode ? `${theme.colors.extended.grey[100]}` : ''};
	}

	${CustomizeBlockStyle}
`

export const Intro = styled.p`
	${baseParagraphStyle}
	font-size: 1.25rem;
	line-height: 2rem;
`

export const Body = styled.p`
	${baseParagraphStyle}
	font-size: 1rem;
	line-height: 1.5rem;
`

export const SmallBody = styled.p`
	${baseParagraphStyle}
	font-size: 0.875rem;
	line-height: 1.25rem;
`

export const ExtraSmallBody = styled.p`
	${baseParagraphStyle}
	font-size: 0.75rem;
	line-height: 1rem;
`
