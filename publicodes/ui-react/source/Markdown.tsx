import React, { useContext } from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { EngineContext, RenderersContext } from './contexts'
import { RuleLinkWithContext } from './RuleLink'
import PublicodesBlock from './PublicodesBlock'

export function LinkRenderer({
	href,
	children,
	...otherProps
}: Omit<React.ComponentProps<'a'>, 'ref'>) {
	const engine = useContext(EngineContext)
	const { Link } = useContext(RenderersContext)
	if (!engine) {
		throw new Error('an engine should be provided in context')
	}
	if (!Link) {
		throw new Error('a Link renderer must be provided')
	}

	if (href && href in engine.getParsedRules()) {
		return (
			<RuleLinkWithContext dottedName={href} {...otherProps}>
				{children}
			</RuleLinkWithContext>
		)
	}

	if (href && !href.startsWith('http')) {
		return <Link to={href}>{children}</Link>
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

const TextRenderer = ({ children }: { children: string }) => <>{children}</>

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
