import { useContext } from 'react'

import { SiteNameContext } from '@/components/Provider'
import { Link } from '@/design-system/typography/link'

type Props = {
	href?: string
	children: React.ReactNode
	title?: string
}

export default function LinkRenderer({ href, children, ...otherProps }: Props) {
	const siteName = useContext(SiteNameContext)
	const internalURLs = {
		'mon-entreprise.urssaf.fr': 'mon-entreprise',
		'mycompanyinfrance.urssaf.fr': 'infrance',
	} as const

	if (otherProps.title?.startsWith('Nouvelle fenêtre')) {
		return (
			<Link target="_blank" rel="noreferrer" href={href} {...otherProps}>
				{children}
			</Link>
		)
	}
	if (href && !href.startsWith('http')) {
		return (
			<Link to={href} {...otherProps}>
				{children}
			</Link>
		)
	}

	// Convert absolute links that reload the full app into in-app links handled
	// by react-router.
	for (const domain of Object.keys(internalURLs)) {
		if (
			href &&
			href.startsWith(`https://${domain}`) &&
			internalURLs[domain as keyof typeof internalURLs] === siteName
		) {
			return (
				<Link to={href.replace(`https://${domain}`, '')} {...otherProps}>
					{children}
				</Link>
			)
		}
	}

	return (
		<Link target="_blank" rel="noreferrer" href={href} {...otherProps}>
			{children}
		</Link>
	)
}
