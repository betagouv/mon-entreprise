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

export const Intro = styled.p<{ $xxl?: boolean }>`
	${baseParagraphStyle}
	font-size: ${({ theme, $xxl }) => theme.fontSizes[$xxl ? 'xxl' : 'xl']};
	line-height: ${({ theme, $xxl }) => theme.lineHeights[$xxl ? 'xxl' : 'xl']};
`

export const BodyStyle = css`
	${baseParagraphStyle}
	font-size: ${({ theme }) => theme.fontSizes.base};
	line-height: ${({ theme }) => theme.lineHeights.base};
`
export const Body = styled.p`
	${BodyStyle}
`

export const SmallBody = styled.p<{ $grey?: boolean }>`
	${baseParagraphStyle}
	font-size: ${({ theme }) => theme.fontSizes.min};
	line-height: ${({ theme }) => theme.lineHeights.sm};

	${({ $grey }) =>
		$grey &&
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
