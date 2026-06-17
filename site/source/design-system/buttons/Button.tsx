import React, { ForwardedRef, forwardRef, useCallback } from 'react'
import { PressEvent } from 'react-aria'
import { css, styled } from 'styled-components'

import { useTracking } from '@/hooks/useTracking'
import { Palette } from '@/types/styled'
import { omit, wrapperDebounceEvents } from '@/utils'

import { FocusStyle } from '../global-style'
import { getColorPalette } from '../theme'
import {
	GenericButtonOrNavLinkProps,
	useButtonOrLink,
} from '../typography/link'

type Size = 'XL' | 'MD' | 'XS' | 'XXS'
type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success'

export type ButtonTracking = {
	feature: string
	action: string
	simulateur?: string
}

type ButtonProps = GenericButtonOrNavLinkProps & {
	color?: ButtonColor
	children: React.ReactNode
	size?: Size
	light?: boolean
	lang?: string
	underline?: boolean
	tracking?: ButtonTracking
}

export const Button = forwardRef(function Button(
	{
		size = 'MD',
		light = false,
		color = 'primary' as const,
		underline,
		isDisabled,
		tracking,
		lang,
		...ariaButtonProps
	}: ButtonProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement | null>
) {
	const { trackClick } = useTracking()

	const originalOnPress = ariaButtonProps.onPress
	const onPressWithTracking = useCallback(
		(e: PressEvent) => {
			if (tracking) {
				trackClick(tracking)
			}
			originalOnPress?.(e)
		},
		[tracking, trackClick, originalOnPress]
	)

	const buttonOrLinkProps = useButtonOrLink(
		{
			...wrapperDebounceEvents({
				...ariaButtonProps,
				onPress: onPressWithTracking,
			}),
			isDisabled,
		},
		forwardedRef
	)

	// Omit isDisabled and openInSameWindow from props cause it's not a valid HTML attribute
	const props = omit(
		buttonOrLinkProps as Record<string, unknown>,
		'isDisabled',
		'openInSameWindow'
	)

	return (
		<StyledButton
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			$size={size}
			$light={light}
			$color={color}
			disabled={isDisabled}
			$underline={underline}
			lang={lang}
		/>
	)
})

type StyledButtonProps = {
	disabled?: boolean
	$color: ButtonColor
	$size: Size
	$light: boolean
	$underline?: boolean
}

export const StyledButton = styled.button<StyledButtonProps>`
	width: fit-content;
	display: flex;
	align-items: center;
	gap: 0 ${({ theme }) => theme.spacings.xs};
	text-decoration: none;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 500;

	padding: ${({ $size }) => {
		switch ($size) {
			case 'XL':
				return '1.25rem 2rem'
			case 'MD':
				return '0.875rem 2rem'
			case 'XS':
				return '0.5rem 1.5rem'
			case 'XXS':
				return '0.25rem 1rem'
		}
	}};
	border-radius: 2.5rem;
	transition: all 0.15s;
	font-size: ${({ theme }) => theme.fontSizes.base};
	line-height: ${({ theme }) => theme.lineHeights.base};
	border: 2px solid transparent;

	${({ disabled }) =>
		disabled &&
		css`
			opacity: 50%;
			cursor: not-allowed;
		`}

	&:focus-visible {
		${({ disabled }) =>
			disabled
				? css`
						outline: initial;
				  `
				: ''}
	}

	&:focus {
		${FocusStyle}
	}

	${({ theme, $color, $light, disabled }) => {
		const colorPalette = getColorPalette($color)

		return css`
			/* Regular button colors (same for dark & light mode, except for Primary) */
			${() => {
				const backgroundColor =
					$color === 'primary'
						? (colorPalette as Palette)[700]
						: $color === 'error'
						? colorPalette[400]
						: colorPalette[300]
				const color =
					theme.colors.extended.grey[
						$color === 'primary' || $color === 'error' ? 100 : 800
					]

				return css`
					background-color: ${backgroundColor};
					color: ${color};
					svg {
						fill: ${color};
					}
				`
			}}

			/* Light button colors */
			${() => {
				const color =
					$color === 'error'
						? colorPalette[500]
						: $color === 'success'
						? colorPalette[600]
						: (colorPalette as Palette)[700]
				const borderColor =
					$color === 'primary'
						? (colorPalette as Palette)[700]
						: $color === 'error'
						? colorPalette[400]
						: colorPalette[600]

				return (
					$light &&
					!theme.darkMode &&
					css`
						color: ${color};
						background-color: ${theme.colors.extended.grey[100]};
						border-color: ${borderColor};
						svg {
							fill: ${color};
						}
					`
				)
			}}

			/* HOVER STYLE */
			&:hover {
				${() => {
					const backgroundColor =
						$color === 'primary'
							? (colorPalette as Palette)[800]
							: $color === 'error'
							? colorPalette[500]
							: colorPalette[400]

					/* Regular button (same for dark & light mode, except for Primary) */
					return (
						!disabled &&
						!$light &&
						css`
							background-color: ${backgroundColor};
						`
					)
				}}

				/* Light button */
				${() =>
					!disabled &&
					!theme.darkMode &&
					$light &&
					css`
						background-color: ${colorPalette[100]};
					`}
			}

			/* DARK MODE */
			@media not print {
				/* Regular button Primary */
				${() =>
					theme.darkMode &&
					$color === 'primary' &&
					css`
						color: ${(colorPalette as Palette)[700]};
						background-color: ${theme.colors.extended.grey[100]};
						svg {
							fill: ${(colorPalette as Palette)[700]};
						}
					`}

				/* Light button colors */
				${() => {
					const color =
						$color === 'primary'
							? theme.colors.extended.grey[100]
							: $color === 'error'
							? colorPalette[200]
							: colorPalette[400]

					return (
						theme.darkMode &&
						$light &&
						css`
							background-color: transparent;
							border-color: ${color};
							color: ${color};
							svg {
								fill: ${color};
							}
						`
					)
				}}

				&:hover {
					${() => {
						if (!disabled && theme.darkMode) {
							/* Light button */
							if ($light) {
								return css`
									background-color: ${theme.colors.extended.dark[700]};
								`
							} else {
								/* Regular button Primary */
								if ($color === 'primary') {
									return css`
										background-color: ${theme.colors.extended.grey[300]};
									`
								}
							}
						}
					}}
			}
		`
	}}

	${({ $underline }) =>
		$underline &&
		css`
			background-color: transparent;
			padding: 0;
			border: none;
			color: ${({ theme }) => theme.colors.bases.primary[700]};
			border-radius: 0;
			display: flex;
			align-items: center;
			text-decoration: underline;
			svg {
				margin-right: ${({ theme }) => theme.spacings.xxs};
				fill: ${({ theme }) => theme.colors.bases.primary[700]};
			}
			&:hover {
				border: none;
				background-color: transparent;
				text-decoration: underline;
			}

			&:focus {
				${FocusStyle}
			}
		`}
`
