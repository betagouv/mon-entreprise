import React from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { Link } from 'react-router-dom'

function LinkRenderer({ href, children }) {
	if (href.startsWith('http')) {
		return (
			<a target="_blank" href={href}>
				{children}
			</a>
		)
	} else {
		return <Link to={href}>{children}</Link>
	}
}

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
		renderers={{ ...renderers, link: LinkRenderer }}
		{...otherProps}
	/>
)
