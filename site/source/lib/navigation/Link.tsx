'use client'

import { ComponentProps, forwardRef } from 'react'
import { Link as RRLink, NavLink as RRNavLink } from 'react-router-dom'

interface LinkProps {
	to: string
	children: React.ReactNode
	className?: string
	style?: React.CSSProperties
	target?: string
	rel?: string
	onClick?: (e: React.MouseEvent) => void
}

/**
 * Composant Link unifié
 * Abstraction de Link (react-router) pour future compatibilité Next.js
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
	({ to, children, ...props }, ref) => (
		<RRLink to={to} ref={ref} {...props}>
			{children}
		</RRLink>
	)
)

Link.displayName = 'Link'

/**
 * Composant NavLink unifié
 * Abstraction de NavLink (react-router) pour future compatibilité Next.js
 * Permet d'appliquer des styles conditionnels selon si le lien est actif
 */
export const NavLink = forwardRef<
	HTMLAnchorElement,
	ComponentProps<typeof RRNavLink>
>((props, ref) => <RRNavLink ref={ref} {...props} />)

NavLink.displayName = 'NavLink'
