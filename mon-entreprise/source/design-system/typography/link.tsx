import { useButton } from '@react-aria/button'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import React, { useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const StyledLinkHover = css`
	text-decoration: underline;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[100]
			: theme.colors.bases.primary[800]};
`
export const StyledLink = styled.a`
	display: inline-flex;
	flex-direction: row;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.bases.primary[700]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	font-size: inherit;
	text-decoration: none;
	padding: 0;

	&:hover {
		${StyledLinkHover}
	}
`

export const Link = (
	ariaButtonProps: GenericButtonOrLinkProps & { children: React.ReactNode }
) => {
	const elementType: 'a' | 'button' | typeof RouterLink =
		'href' in ariaButtonProps
			? 'a'
			: 'to' in ariaButtonProps
			? RouterLink
			: 'button'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	return (
		<StyledLink
			{...ariaButtonProps}
			{...buttonProps}
			as={elementType}
			ref={ref as any}
		/>
	)
}
