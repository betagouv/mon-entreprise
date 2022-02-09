import { FocusStyle } from 'DesignSystem/global-style'
import {
	GenericButtonOrLinkProps,
	useButtonOrLink,
} from 'DesignSystem/typography/link'
import React, { ForwardedRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonProps = GenericButtonOrLinkProps & {
	color?: Color
	children: React.ReactNode
	size?: Size
	light?: boolean
}

export const Button = forwardRef(function Button(
	{
		size = 'MD',
		light = false,
		color = 'primary' as const,
		className,
		...ariaButtonProps
	}: ButtonProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, forwardedRef)
	return (
		<StyledButton
			{...buttonOrLinkProps}
			className={className}
			size={size}
			light={light}
			color={color}
		/>
	)
})

type StyledButtonProps = {
	color: Color
	size: Size
	light: boolean
	isDisabled?: boolean
}

export const StyledButton = styled.button<StyledButtonProps>`
	width: fit-content;
	display: inline-block;
	text-decoration: none;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 500;

	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
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
	${({ isDisabled }) =>
		isDisabled &&
		css`
			opacity: 50%;
			cursor: not-allowed;
		`}
	&:active {
		transform: translateY(3px);
	}
	&:focus-visible {
		${FocusStyle}
	}
	/* Primary, secondary & tertiary colors */
	${({ theme, color }) =>
		!theme.darkMode &&
		css`
			border-color: ${theme.colors.bases[color][
				color === 'primary' ? 700 : color === 'secondary' ? 500 : 300
			]};

			background-color: ${theme.colors.bases[color][
				color === 'primary' ? 700 : 300
			]};
			color: ${theme.colors.extended.grey[color === 'primary' ? 100 : 800]};
		`}

	/* Primary, secondary & tertiary light colors */
	${({ light, color, theme }) =>
		light &&
		!theme.darkMode &&
		css`
			color: ${theme.colors.bases[color][color === 'primary' ? 700 : 700]};
			background-color: ${theme.colors.extended.grey[100]};
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
		${({ light, theme }) =>
			theme.darkMode &&
			light &&
			css`
				background-color: transparent;
				border-color: ${theme.colors.extended.grey[100]};
				color: ${theme.colors.extended.grey[100]};
			`}
	}
	/* HOVER STYLE */
	:hover {
		${({ theme, color, isDisabled, light }) =>
			isDisabled || theme.darkMode
				? ''
				: /* Primary, secondary & tertiary light colors */
				light
				? css`
						background-color: ${theme.colors.bases[color][
							color === 'primary' ? 200 : color === 'secondary' ? 100 : 100
						]};
				  `
				: /* Primary, secondary & tertiary colors */
				  css`
						background-color: ${theme.colors.bases[color][
							color === 'primary' ? 800 : color === 'secondary' ? 500 : 400
						]};
				  `}
	}

	/* Dark mode */
	@media not print {
		:hover {
			${({ light, theme, isDisabled }) =>
				isDisabled || !theme.darkMode
					? ''
					: /* White color and light mode (dark background mode) */
					light
					? css`
							color: rgba(255, 255, 255, 25%);
							opacity: 1;
					  `
					: /* White color (dark background mode) */
					  css`
							opacity: 80%;
					  `}
		}
	}
`
