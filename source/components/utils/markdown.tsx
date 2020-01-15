import React from 'react'
import emoji from 'react-easy-emoji'
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
