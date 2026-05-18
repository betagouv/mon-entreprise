import { css, styled } from 'styled-components'

import { Palette } from '@/types/styled'

import { Color, getColorPalette } from '../theme'

interface TagProps {
	children?: React.ReactNode
	className?: string
	color?: Color
}

export const Tag = ({ children, color }: TagProps) => (
	<StyledTag $color={color}>{children}</StyledTag>
)

const StyledTag = styled.span<{ $color?: Color }>`
	font-family: ${({ theme }) => theme.fonts.main};

	display: inline-flex;
	vertical-align: middle;
	align-items: center;
	width: fit-content;
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-weight: 500;
	font-size: 0.75rem;
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
