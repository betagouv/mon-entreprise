import { css, styled } from 'styled-components'

export const baseParagraphStyle = css`
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	color: ${({ theme }) => theme.colors.extended.grey[800]};
	background-color: transparent;

	@media not print {
		${({ theme }) =>
			theme.darkMode &&
			css`
				color: ${theme.colors.extended.grey[100]};
			`}
	}
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

export const SmallBody = styled.p<{ grey?: boolean }>`
	${baseParagraphStyle}
	font-size: 0.875rem;
	line-height: 1.25rem;

	${({ grey }) =>
		grey &&
		css`
			color: ${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.grey[500]
					: theme.colors.extended.grey[600]};

			svg {
				fill: ${({ theme }) =>
					theme.darkMode
						? theme.colors.extended.grey[500]
						: theme.colors.extended.grey[600]};
			}
		`}
`

export const ExtraSmallBody = styled.p`
	${baseParagraphStyle}
	font-size: 0.75rem;
	line-height: 1rem;
`
