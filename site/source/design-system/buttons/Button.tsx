import { PressEvent } from '@react-types/shared'
import React, { ForwardedRef, forwardRef, useCallback } from 'react'
import { css, styled } from 'styled-components'

import { useTracking } from '@/hooks/useTracking'
import { omit, wrapperDebounceEvents } from '@/utils'

import { FocusStyle } from '../global-style'
import {
	GenericButtonOrNavLinkProps,
	useButtonOrLink,
} from '../typography/link'

type Size = 'XL' | 'MD' | 'XS' | 'XXS'
type Color = 'primary' | 'secondary' | 'tertiary'

export type ButtonTracking = {
	feature: string
	action: string
	simulateur?: string
}

type ButtonProps = GenericButtonOrNavLinkProps & {
	color?: Color
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
	$color: Color
	$size: Size
	$light: boolean
	$underline?: boolean
}

export const StyledButton = styled.button<StyledButtonProps>`
	width: fit-content;
	display: inline-block;
	text-decoration: none;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 500;

	padding: ${({ $size }) => {
		if ($size === 'XL') {
			return '1.25rem 2rem'
		}
		if ($size === 'MD') {
			return '0.875rem 2rem'
		}
		if ($size === 'XS') {
			return '0.5rem 2rem'
		}
		if ($size === 'XXS') {
			return '0.25rem 1rem'
		}
	}};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		width: 100%;
		text-align: center;
	}
	border-radius: 2.5rem;
	transition: all 0.15s;
	font-size: 1rem;
	line-height: 1.5rem;
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

	/* Primary, secondary & tertiary colors */
	${({ theme, $color }) =>
		!theme.darkMode &&
		css`
			border-color: ${theme.colors.bases[$color][
				$color === 'primary' ? 700 : $color === 'tertiary' ? 600 : 300
			]};

			background-color: ${theme.colors.bases[$color][
				$color === 'primary' ? 700 : 300
			]};
			color: ${theme.colors.extended.grey[$color === 'primary' ? 100 : 800]};
		`}

	/* Primary, secondary & tertiary light colors */
	${({ $light, $color, theme }) =>
		$light &&
		!theme.darkMode &&
		css`
			color: ${theme.colors.bases[$color][$color === 'primary' ? 700 : 700]};
			background-color: ${theme.colors.extended.grey[100]};
			${($color === 'secondary' || $color === 'tertiary') &&
			css`
				border-color: ${theme.colors.bases[$color][500]};
			`};
		`}

	@media not print {
		/* White color (dark background mode) */
		${({ theme }) =>
			theme.darkMode &&
			css`
				color: ${theme.colors.bases.primary[700]};
				background-color: ${theme.colors.extended.grey[100]};
			`}

		/* White color and light mode (dark background mode) */
		${({ $light, theme }) =>
			theme.darkMode &&
			$light &&
			css`
				background-color: transparent;
				border-color: ${theme.colors.extended.grey[100]};
				color: ${theme.colors.extended.grey[100]};
			`}
	}

	/////////////////////

	/* HOVER STYLE */
	&:hover {
		${({ theme, $color, disabled, $light }) =>
			disabled || theme.darkMode
				? ''
				: /* Primary, secondary & tertiary light colors */
				$light
				? css`
						background-color: ${theme.colors.bases[$color][
							$color === 'primary' ? 200 : $color === 'secondary' ? 100 : 100
						]};
				  `
				: /* Primary, secondary & tertiary colors */
				  css`
						background-color: ${theme.colors.bases[$color][
							$color === 'primary' ? 800 : 400
						]};
						border-color: ${theme.colors.bases[$color][
							$color === 'primary' ? 800 : 400
						]};
				  `}
	}

	/* Dark mode */
	@media not print {
		&:hover {
			${({ $light, theme, disabled }) =>
				disabled || !theme.darkMode
					? ''
					: /* White color and light mode (dark background mode) */
					$light
					? css`
							color: rgba(255, 255, 255, 75%);
							background-color: inherit;
							opacity: 1;
					  `
					: /* White color (dark background mode) */
					  css`
							opacity: 80%;
					  `}
		}
	}

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
