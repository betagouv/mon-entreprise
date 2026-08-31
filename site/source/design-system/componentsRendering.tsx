import {
	Body,
	Code,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	Li,
	Link,
	Ol,
	Pre,
	Strong,
	U,
	Ul,
} from './typography'

type LinkRendererProps = {
	href?: string
	children: React.ReactNode
	title?: string
}
const LinkRenderer = ({ href, children, ...otherProps }: LinkRendererProps) => {
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

type ImgRendererProps = {
	src: string
	alt?: string
}
const ImgRenderer = ({ src, alt }: ImgRendererProps) => (
	<img src={src} alt={alt || ''} />
)

export const componentsRendering = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	p: Body,
	strong: Strong,
	u: U,
	ul: Ul,
	ol: Ol,
	li: Li,
	code: Code,
	pre: Pre,
	img: ImgRenderer,
	a: LinkRenderer,
}
