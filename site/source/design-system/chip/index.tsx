import React from 'react'
import { css, styled } from 'styled-components'

import { Palette } from '@/types/styled'

import { Emoji } from '../emoji'
import { getColorPalette } from '../theme'
import { ComponentType } from '../types'
import { getIconFromType } from '../utils'

type ChipProps = {
	children: React.ReactNode
	icon?: boolean | React.ReactElement<typeof Emoji>
	type?: ComponentType
	className?: string
	title?: string
}

export function Chip({
	type = 'primary',
	icon = false,
	children,
	title,
}: ChipProps) {
	return (
		<StyledChip $type={type} title={title}>
			{icon && (
				<StyledIconWrapper $type={type}>
					{typeof icon !== 'boolean' ? icon : getIconFromType(type)}
				</StyledIconWrapper>
			)}
			{children}
		</StyledChip>
	)
}

const StyledIconWrapper = styled.span<{
	$type: ComponentType
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: ${({ theme }) => theme.spacings.xxs};
	svg {
		fill: ${({ $type }) => getTextColorFromType($type)};
	}
`

const StyledChip = styled.strong<{
	$type: ComponentType
}>`
	display: inline-flex;
	align-items: center;
	white-space: nowrap;
	${({ theme }) => css`
		margin: 0 ${theme.spacings.xxs};
		border-radius: ${theme.spacings.md};
		font-family: ${theme.fonts.main};
		padding: ${theme.spacings.xxs} ${theme.spacings.xs};
		font-size: ${theme.fontSizes.base};
		text-align: center;
	`}
	${({ theme, $type }) => {
		/* Different colors for Primary in dark mode */
		if (theme.darkMode && $type === 'primary') {
			const colorPalette = getColorPalette($type)

			return css`
				@media not print {
					color: ${(colorPalette as Palette)[700]};
					background-color: ${theme.colors.extended.grey[100]};
				}
			`
		}

		return css`
			background-color: ${getBackgroundColorFromType($type)};
			color: ${getTextColorFromType($type)};
		`
	}}
`

const getTextColorFromType = (type: ComponentType) => {
	const colorPalette = getColorPalette(type)

	return type === 'error'
		? colorPalette[100]
		: (colorPalette as Palette)[700] ?? colorPalette[600]
}

const getBackgroundColorFromType = (type: ComponentType) => {
	const colorPalette = getColorPalette(type)

	return type === 'error' ? colorPalette[400] : colorPalette[300]
}
