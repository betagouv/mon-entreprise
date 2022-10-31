import styled, { css } from 'styled-components'

import { baseParagraphStyle } from './paragraphs'

type ListProps = {
	size?: 'XS' | 'MD' | 'XL'
}

export const Li = styled.li``

const BaseListStyle = css<ListProps>`
	${baseParagraphStyle}
	font-size: 1rem;
	line-height: 1.5rem;
	list-style: none;
	padding: 0;
	${({ size = 'MD' }) =>
		size === 'XS'
			? css`
					font-size: 0.875rem;
					line-height: 1.25rem;
			  `
			: size === 'XL' &&
			  css`
					font-size: 1.25rem;
					line-height: 2rem;
					padding-left: 2rem;
			  `}

	${Li} {
		position: relative;
		padding-left: ${({ theme }) => theme.spacings.lg};
		margin-bottom: ${({ theme }) => theme.spacings.xs};
	}
`

export const Ul = styled.ul<ListProps>`
	${BaseListStyle}
	${Li}::before {
		content: '●';
		font-size: 80%;
		display: inline-block;
		position: absolute;
		left: 0;
		width: ${({ theme }) => theme.spacings.lg};
		text-align: center;
		color: ${({ theme }) => theme.colors.bases.secondary[400]};
		background-color: inherit;
		margin-bottom: ${({ theme }) => theme.spacings.xs};
	}
`

export const Ol = styled.ol<ListProps>`
	${BaseListStyle}

	${({ size = 'MD' }) =>
		size === 'XS'
			? css`
					font-size: 0.875rem;
					line-height: 1.25rem;
			  `
			: size === 'XL' &&
			  css`
					font-size: 1.25rem;
					line-height: 2rem;
			  `}

	${Li} {
		counter-increment: step-counter;
		padding-left: ${({ theme }) => theme.spacings.xl};

		${({ size = 'MD', theme }) =>
			size === 'XS'
				? css`
						padding-left: ${theme.spacings.lg};
				  `
				: size === 'XL' &&
				  css`
						padding-left: ${theme.spacings.xxl};
				  `}
	}
	${Li}::before {
		content: counter(step-counter);
		font-size: 1.125rem;
		font-weight: 500;
		border-radius: 100%;
		justify-content: center;
		align-items: center;
		display: inline-flex;
		position: absolute;
		left: 0;
		${({ theme, size }) => css`
			width: ${theme.spacings.lg};
			height: ${theme.spacings.lg};
			background-color: ${theme.colors.bases.secondary[500]};
			color: ${theme.colors.extended.grey[100]};
			vertical-align: baseline;
			${size === 'XS'
				? css`
						font-size: 0.875rem;
						width: ${theme.spacings.md};
						height: ${theme.spacings.md};
				  `
				: size === 'XL' &&
				  css`
						font-size: 1.25rem;
						width: ${theme.spacings.xl};
						height: ${theme.spacings.xl};
				  `}
		`}
	}
`
