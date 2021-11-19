import styled, { css } from 'styled-components'
import { baseParagraphStyle } from './paragraphs'

type UlProps = {
	small?: boolean
}

export const Li = styled.li``
export const Ul = styled.ul<UlProps>`
	${baseParagraphStyle}
	font-size: 1rem;
	line-height: 1.5rem;
	list-style: none;
	position: relative;
	padding-left: ${({ theme }) => theme.spacings.lg};
	${({ small }) =>
		small &&
		css`
			font-size: 0.875rem;
			line-height: 1.25rem;
		`}
	> ${Li} {
		&::before {
			content: '●';
			font-size: 80%;
			display: inline-block;
			position: absolute;
			left: 0;
			width: ${({ theme }) => theme.spacings.lg};
			text-align: center;
			color: ${({ theme }) => theme.colors.bases.secondary[400]};
			margin-bottom: ${({ theme }) => theme.spacings.xs};
		}
	}
`
