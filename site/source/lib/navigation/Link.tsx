'use client'

import { forwardRef } from 'react'
import { Link as RRLink } from 'react-router-dom'

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
