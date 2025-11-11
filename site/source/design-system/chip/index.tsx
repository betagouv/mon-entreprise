import React from 'react'
import { css, styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Palette, SmallPalette } from '@/types/styled'

import { Emoji } from '../emoji'
import { ErrorIcon, InfoIcon, SuccessIcon } from '../icons'
import { textColorFromType } from '../message'

export type ChipType = 'primary' | 'secondary' | 'info' | 'error' | 'success'
type ChipProps = {
	children: React.ReactNode
	icon?: boolean | React.ReactElement<typeof Emoji>
	type?: ChipType
	className?: string
	title?: string
}

export function Chip({
	type = 'primary',
	icon = false,
	children,
	className,
	title,
}: ChipProps) {
	return (
		<ForceThemeProvider forceTheme="light">
			<StyledChip className={className} $type={type} title={title}>
				{icon && (
					<StyledIconWrapper $type={type}>
						{typeof icon !== 'boolean' ? (
							icon
						) : type === 'success' ? (
							<SuccessIcon />
						) : type === 'error' ? (
							<ErrorIcon />
						) : type === 'info' ? (
							<InfoIcon />
						) : (
							<></>
						)}
					</StyledIconWrapper>
				)}
				{children}
			</StyledChip>
		</ForceThemeProvider>
	)
}
const StyledIconWrapper = styled.span<{
	$type: ChipProps['type']
}>`
	margin-right: ${({ theme }) => theme.spacings.xxs};
	vertical-align: middle;
	svg {
		fill: ${({ theme, $type }) =>
			$type === 'error'
				? theme.colors.extended.grey[100]
				: textColorFromType($type, theme)};
	}
`

const StyledChip = styled.strong<
	Pick<ChipProps, 'type'> & {
		$type: NonNullable<ChipProps['type']>
	}
>`
	vertical-align: middle;
	white-space: nowrap;
	${({ theme, $type }) => {
		const colorSpace: Palette | SmallPalette =
			$type === 'secondary' || $type === 'primary'
				? theme.colors.bases[$type]
				: theme.colors.extended[$type]

		return css`
			margin: 0 ${theme.spacings.xxs};
			border-radius: ${theme.spacings.md};
			font-family: ${theme.fonts.main};
			padding: ${theme.spacings.xxs} ${theme.spacings.xs};
			background-color: ${$type === 'error'
				? colorSpace[400]
				: colorSpace[300]};

			font-size: ${theme.baseFontSize};
			text-align: center;
			color: ${$type === 'error'
				? theme.colors.extended.grey[100]
				: textColorFromType($type, theme)};
		`
	}}
`
