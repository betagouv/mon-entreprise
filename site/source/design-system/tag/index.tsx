import styled from 'styled-components'

import { baseTheme, getColorGroup } from '../theme'

export type TagType = keyof typeof baseTheme.colors.bases &
	keyof typeof baseTheme.colors.extended &
	keyof typeof baseTheme.colors.publics &
	undefined

type SizeType = 'sm' | 'md' | 'lg'

const lightColors = ['grey']

export const Tag = styled.div<{ $color: TagType; $size?: SizeType }>`
	font-family: ${({ theme }) => theme.fonts.main};

	display: flex;
	align-items: center;
	width: fit-content;
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-weight: 500;
	background-color: ${({ theme, $color }) =>
		$color
			? theme.colors[getColorGroup($color)][$color][
					lightColors.includes($color) ? 300 : 100
			  ]
			: theme.colors.bases.primary[100]};
	color: ${({ theme, $color }) =>
		$color
			? theme.colors[getColorGroup($color)][$color][
					lightColors.includes($color) ? 800 : 600
			  ]
			: theme.colors.extended.grey[800]};
	font-size: ${({ $size }) => {
		switch ($size) {
			case 'sm':
				return '0.75rem'
			case 'md':
			default:
				return '1rem'
		}
	}};
	svg {
		fill: ${({ theme, $color }) =>
			$color
				? theme.colors[getColorGroup($color)][$color][600]
				: theme.colors.extended.grey[800]};
	}
`
