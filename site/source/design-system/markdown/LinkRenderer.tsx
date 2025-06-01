import { Link } from '@/design-system'

type Props = {
	href?: string
	children: React.ReactNode
	title?: string
}

export default function LinkRenderer({ href, children, ...otherProps }: Props) {
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

	// Convert absolute links on the same domain to relative links
	if (href && typeof window !== 'undefined') {
		try {
			const linkUrl = new URL(href)
			const currentUrl = new URL(window.location.href)

			// If the link is on the same host, convert to relative
			if (linkUrl.hostname === currentUrl.hostname) {
				return (
					<Link
						to={linkUrl.pathname + linkUrl.search + linkUrl.hash}
						{...otherProps}
					>
						{children}
					</Link>
				)
			}
		} catch {
			// If URL parsing fails, fall through to external link
		}
	}

	return (
		<Link target="_blank" rel="noreferrer" href={href} {...otherProps}>
			{children}
		</Link>
	)
}
