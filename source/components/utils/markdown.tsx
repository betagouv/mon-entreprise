import React from 'react'
import emoji from 'react-easy-emoji'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { Link } from 'react-router-dom'

function LinkRenderer({ href, children }) {
	if (!href.startsWith('http')) {
		return <Link to={href}>{children}</Link>
	}

	// Convert absolute links that reload the full app into in-app links handled
	// by react-router.
	const domain = 'mon-entreprise.fr'
	if (
		href.startsWith(`https://${domain}`) &&
		(location.hostname === 'localhost' || location.hostname === domain)
	) {
		return <Link to={href.replace(`https://${domain}`, '')}>{children}</Link>
	}

	return (
		<a target="_blank" href={href}>
			{children}
		</a>
	)
}
const TextRenderer = ({ children }) => <>{emoji(children)}</>

type MarkdownProps = ReactMarkdownProps & {
	source: string
	className?: string
}

export const Markdown = ({
	source,
	className = '',
	renderers = {},
	...otherProps
}: MarkdownProps) => (
	<ReactMarkdown
		source={source}
		className={`markdown ${className}`}
		renderers={{ link: LinkRenderer, text: TextRenderer, ...renderers }}
		{...otherProps}
	/>
)
