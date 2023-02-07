import styled, { css } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { Ul } from '@/design-system/typography/list'
import { baseParagraphStyle } from '@/design-system/typography/paragraphs'

export const Recap = styled.div`
	background: ${({ theme }) => {
		const colorPalette = theme.colors.bases.primary

		return css`linear-gradient(60deg, ${colorPalette[800]} 0%, ${colorPalette[600]} 100%);`
	}};
	color: inherit;
	border-radius: 0.25rem;
	padding: 1.5rem;
	${baseParagraphStyle}
	line-height: 1.5rem;
	color: white;

	hr {
		border-color: ${({ theme }) => theme.colors.bases.primary[500]};
		margin-bottom: 1rem;
		width: 100%;
	}
`

export const Bold = styled.div`
	font-weight: 700;
	margin-bottom: 0.5rem;
`

export const Italic = styled.div`
	font-style: italic;
	margin-bottom: 0.5rem;
`

export const GridTotal = styled(Grid)`
	${Bold} {
		font-size: 1.25rem;
		line-height: 1.5rem;
		font-weight: 700;
	}
`

export const Total = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 0.5rem;
	padding-left: 1rem;
`

export const RecapExpert = styled(Ul)`
	border-radius: 0.25rem;
	padding: 0 1.5rem;
	${baseParagraphStyle}
	line-height: 1.5rem;
`
