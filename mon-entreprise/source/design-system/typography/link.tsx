import { ReactEventHandler, ReactNode } from 'react'
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

type LinkProps =
	| {
			href: string
			children: ReactNode
	  }
	| {
			onClick: ReactEventHandler
			children: ReactNode
	  }
	| {
			to: string
			children: ReactNode
	  }

export const Link = (props: LinkProps) => {
	if ('href' in props)
		return <AnchorLink {...props} target="_blank" rel="noreferrer" />
	if ('onClick' in props) return <ButtonLink {...props} />
	if ('to' in props) return <StyledRouterLink {...props} />
	else {
		return null
	}
}
