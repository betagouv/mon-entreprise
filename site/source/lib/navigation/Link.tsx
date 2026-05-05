'use client'

import { LinkProps } from './NavigationAPI'
import { useNavigation } from './useNavigation'

export function Link(props: LinkProps) {
	const { Link: RouterLink } = useNavigation()

	return <RouterLink {...props} />
}
