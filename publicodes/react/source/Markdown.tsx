import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { HashLink as Link } from 'react-router-hash-link'
import { EngineContext } from './contexts'
import { RuleLinkWithContext } from './RuleLink'
import PublicodesBlock from './PublicodesBlock'

export function LinkRenderer({
	href,
	children,
	...otherProps
}: Omit<React.ComponentProps<'a'>, 'ref'>) {
	const engine = useContext(EngineContext)
	if (!engine) {
		throw new Error('an engine should be provided in context')
	}

	if (href && href in engine.getRules()) {
		return (
			<RuleLinkWithContext dottedName={href} {...otherProps}>
				{children}
			</RuleLinkWithContext>
		)
	}

	if (href && !href.startsWith('http')) {
		return (
			<Link to={href} {...otherProps}>
				{children}
			</Link>
		)
	}

	return (
		<a target="_blank" href={href} {...otherProps}>
			{children}
		</a>
	)
}

const CodeBlock = ({ value, language }: { value: string; language: string }) =>
	language === 'yaml' ? (
		<PublicodesBlock source={value} />
	) : (
		<pre>
			<code>{value}</code>
		</pre>
	)

const TextRenderer = ({ children }: { children: string }) => (
	<>{emoji(children)}</>
)

type MarkdownProps = ReactMarkdownProps & {
	source: string | undefined
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
		renderers={{
			link: LinkRenderer,
			text: TextRenderer,
			code: CodeBlock,
			...renderers,
		}}
		{...otherProps}
	/>
)
