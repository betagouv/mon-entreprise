import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import React, { ComponentPropsWithRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

const baseLinkStyle = css`
	display: inline-flex;
	flex-direction: row;
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 300;
	font-size: inherit;
	text-decoration: none;
	padding: 0;

	&:hover {
		text-decoration: underline;
		color: ${({ theme }) => theme.colors.bases.primary[800]};
	}
`

const AnchorLink = styled.a`
	${baseLinkStyle}
`
const ButtonLink = styled.button`
	${baseLinkStyle}
`
const StyledRouterLink = styled(RouterLink)`
	${baseLinkStyle}
`

export const Link = (
	props: GenericButtonOrLinkProps & { children: React.ReactNode }
) => {
	if (
		'href' in props ||
		('elementType' in props && props.elementType === 'anchor')
	)
		return <AnchorLink {...props} target="_blank" rel="noreferrer" />
	if (
		'onClick' in props ||
		('elementType' in props && props.elementType === 'button')
	)
		return <ButtonLink {...(props as ComponentPropsWithRef<'button'>)} />
	if ('to' in props) return <StyledRouterLink {...props} />
	else {
		return null
	}
}
