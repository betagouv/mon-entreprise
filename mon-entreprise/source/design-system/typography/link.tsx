import { useButton } from '@react-aria/button'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import { FocusStyle } from 'DesignSystem/global-style'
import React, { forwardRef, useCallback, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const StyledLinkHover = css`
	text-decoration: underline;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[100]
			: theme.colors.bases.primary[800]};
`
export const StyledLink = styled.a`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	font-size: inherit;
	text-decoration: none;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	&:hover {
		${StyledLinkHover}
	}
	&:focus {
		${FocusStyle}
	}
`

export const Link = forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	GenericButtonOrLinkProps & { children: React.ReactNode }
>((ariaButtonProps, forwardedRef) => {
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
				].includes(key)
		)
	)
	return (
		<StyledLink
			{...initialProps}
			{...buttonProps}
			as={elementType}
			ref={ref as any}
		/>
	)
})
