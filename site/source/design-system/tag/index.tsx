import { css, styled } from 'styled-components'

import { Palette } from '@/types/styled'

import { Color, getColorPalette } from '../theme'

interface TagProps {
	children?: React.ReactNode
	color?: Color
}

export const Tag = ({ children, color }: TagProps) => (
	<StyledTag $color={color}>{children}</StyledTag>
)

const StyledTag = styled.span<{ $color?: Color }>`
	display: inline-flex;
	vertical-align: middle;
	align-items: center;
	width: fit-content;
	padding: ${({ theme }) => `${theme.spacings.xxs} ${theme.spacings.xs}`};
	border-radius: 0.25rem;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 500;
	font-size: ${({ theme }) => theme.fontSizes.min};
	line-height: 1rem;

	${({ theme, $color }) => {
		const colorPalette = $color ? getColorPalette($color) : null
		const textColor = (colorPalette as Palette)?.[700] ?? colorPalette?.[600]
		const backgroundColor =
			colorPalette?.[200] || theme.colors.extended.grey[400]

		return css`
			background-color: ${backgroundColor};
			color: ${textColor};
			svg {
				fill: ${textColor || 'black'};
			}
		`
	}}
`
