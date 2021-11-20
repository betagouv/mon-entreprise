import { useButton } from '@react-aria/button'
import { AriaButtonProps } from '@react-types/button'
import { FocusStyle } from 'DesignSystem/global-style'
import { ComponentPropsWithRef, forwardRef, useCallback, useRef } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

export type GenericButtonOrLinkProps =
	| ({ href: string } & AriaButtonProps<'a'>)
	| (AriaButtonProps<typeof NavLink> &
			ComponentPropsWithRef<typeof NavLink> &
			NavLinkProps)
	| AriaButtonProps<'button'>

type ButtonProps = GenericButtonOrLinkProps & {
	color?: Color
	children: React.ReactNode
	size?: Size
	light?: boolean
}

export const Button = forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	ButtonProps
>(function Button(
	{
		size = 'MD',
		light = false,
		color = 'primary' as const,
		...ariaButtonProps
	},
	forwardedRef
) {
	const elementType: 'a' | 'button' | typeof NavLink =
		'href' in ariaButtonProps
			? 'a'
			: 'to' in ariaButtonProps
			? NavLink
			: 'button'

	const defaultRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
	const { buttonProps } = useButton(
		{ elementType, ...ariaButtonProps },
		defaultRef
	)
	const ref = useCallback(
		(instance) => {
			defaultRef.current = instance
			if (typeof forwardedRef === 'function') {
				forwardedRef(instance)
			}
			if (forwardedRef && 'current' in forwardedRef) {
				forwardedRef.current = instance
			}
		},
		[forwardedRef]
	)

	const initialProps = Object.fromEntries(
		Object.entries(ariaButtonProps).filter(
			([key]) =>
				![
					'onPress',
					'onPressChange',
					'onPressEnd',
					'onPressStart',
					'onPressUp',
					'excludeFromTabOrder',
				].includes(key)
		)
	)

	return (
		<StyledButton
			{...initialProps}
			{...buttonProps}
			size={size}
			light={light}
			color={color}
			ref={ref as any}
			as={elementType}
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
	text-decoration: none;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		width: 100%;
	}
	border-radius: 2.5rem;
	transition: all 0.15s;
	font-size: 1rem;
	line-height: 1.5rem;

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
			border: 2px solid
				${theme.colors.bases[color][
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

	/* White color (dark background mode) */
		${({ theme }) =>
		theme.darkMode &&
		css`
			background-color: ${theme.colors.extended.grey[100]};
			color: transparent;
		`}

		/* White color and light mode (dark background mode) */
		${({ light, theme }) =>
		theme.darkMode &&
		light &&
		css`
			background-color: transparent;
			border-color: 2px solid ${theme.colors.extended.grey[100]};
			color: ${theme.colors.extended.grey[100]};
		`}

		/* HOVER STYLE */
		:hover {
		${({ theme, color, isDisabled, light }) =>
			isDisabled
				? ''
				: /* Primary, secondary & tertiary light colors */
				light && !theme.darkMode
				? css`
						background-color: ${theme.colors.bases[color][
							color === 'primary' ? 200 : color === 'secondary' ? 100 : 100
						]};
				  `
				: /* Primary, secondary & tertiary colors */
				!theme.darkMode
				? css`
						background-color: ${theme.colors.bases[color][
							color === 'primary' ? 800 : color === 'secondary' ? 500 : 400
						]};
				  `
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
`
