import styled from 'styled-components'

import { Colors, getColorGroup, isColor } from '../theme'
import { KeysOfUnion, LG, MD, SM } from '../types'

type SizeProps = SM | MD | LG
type SizeKey = KeysOfUnion<SizeProps>

interface Color {
	light: Colors | string
	dark: Colors | string
}

interface TagProps {
	children?: React.ReactNode
	className?: string
	color?: Colors | Color | string
}

export const Tag = ({
	children,
	className,
	color,
	...size
}: TagProps & Partial<SizeProps>) => (
	<StyledTag
		className={className}
		$color={color}
		$size={
			'sm' in size ? 'sm' : 'md' in size ? 'md' : 'lg' in size ? 'lg' : 'md'
		}
	>
		{children}
	</StyledTag>
)

const StyledTag = styled.span<{ $color?: Color | string; $size: SizeKey }>`
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

	background-color: ${({ theme, $color }) =>
		typeof $color === 'string'
			? isColor($color)
				? getColorGroup($color)?.[200]
				: $color
			: theme.darkMode
			? // darkmode
			  typeof $color?.dark === 'string'
				? isColor($color.dark)
					? getColorGroup($color.dark)?.[200]
					: $color.dark
				: theme.colors.extended.grey[600]
			: // lightmode
			typeof $color?.light === 'string'
			? isColor($color.light)
				? getColorGroup($color.light)?.[400]
				: $color.light
			: theme.colors.extended.grey[400]};

	color: ${({ theme, $color }) =>
		typeof $color === 'string'
			? isColor($color)
				? getColorGroup($color)?.[700]
				: null
			: theme.darkMode
			? // darkmode
			  typeof $color?.dark === 'string'
				? isColor($color.dark)
					? getColorGroup($color.dark)?.[700]
					: null
				: null
			: // lightmode
			typeof $color?.light === 'string'
			? isColor($color.light)
				? getColorGroup($color.light)?.[600]
				: null
			: null};

	svg {
		fill: ${({ theme, $color }) =>
			typeof $color === 'string'
				? isColor($color)
					? getColorGroup($color)?.[700]
					: null
				: theme.darkMode
				? // darkmode
				  typeof $color?.dark === 'string'
					? isColor($color.dark)
						? getColorGroup($color.dark)?.[700]
						: null
					: null
				: // lightmode
				typeof $color?.light === 'string'
				? isColor($color.light)
					? getColorGroup($color.light)?.[600]
					: null
				: null};
	}
`
