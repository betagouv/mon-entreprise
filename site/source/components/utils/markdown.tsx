import { Strong, U } from '@/design-system/typography'
import { H1, H2, H3, H4, H5, H6 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx'
import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { isIterable } from '../../utils'
import { SiteNameContext } from '../../Provider'
import Emoji from './Emoji'
import { Message } from '@/design-system'

const internalURLs = {
	'mon-entreprise.urssaf.fr': 'mon-entreprise',
	'mycompanyinfrance.urssaf.fr': 'infrance',
} as const

export function LinkRenderer({
	href,
	children,
	...otherProps
}: {
	href?: string
	children: React.ReactNode
}) {
	const siteName = useContext(SiteNameContext)

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
const TextRenderer = ({ children }: { children: string }) => (
	<Emoji emoji={children} />
)

type MarkdownProps = React.ComponentProps<typeof MarkdownToJsx> & {
	className?: string
	components?: MarkdownToJSX.Overrides
	renderers?: Record<string, unknown>
}

const CodeBlock = ({
	children,
	className,
}: {
	children: string
	className?: string
}) => (
	<div
		css={`
			position: relative;
		`}
	>
		<pre className="ui__ code">
			<code>{children}</code>
		</pre>
		{className?.includes('lang-yaml') && (
			<a
				href={`https://publi.codes/studio?code=${encodeURIComponent(children)}`}
				target="_blank"
				rel="noreferrer"
				css="position: absolute; bottom: 5px; right: 10px; color: white !important;"
			>
				<Emoji emoji="⚡" /> Lancer le calcul
			</a>
		)}
	</div>
)

export const Markdown = ({
	children,
	components = {},
	...otherProps
}: MarkdownProps) => (
	<MarkdownToJsx
		{...otherProps}
		options={{
			...otherProps.options,
			forceBlock: true,
			overrides: {
				h1: H1,
				h2: H2,
				h3: H3,
				h4: H4,
				h5: H5,
				h6: H6,
				p: Body,
				strong: Strong,
				u: U,
				a: LinkRenderer,
				ul: Ul,
				li: Li,
				code: CodeBlock,
				span: TextRenderer,
				blockquote: Message,
				...components,
			},
		}}
	>
		{children}
	</MarkdownToJsx>
)

export const MarkdownWithAnchorLinks = ({
	renderers = {},
	...otherProps
}: MarkdownProps) => (
	<Markdown
		renderers={{
			heading: HeadingWithAnchorLink,
			...renderers,
		}}
		{...otherProps}
	/>
)

const flatMapChildren = (children: React.ReactNode): Array<string | number> => {
	return React.Children.toArray(children).flatMap((child) =>
		typeof child === 'string' || typeof child === 'number'
			? child
			: isIterable(child)
			? flatMapChildren(Array.from(child))
			: typeof child == 'object' && 'props' in child
			? // eslint-disable-next-line
			  (child.props?.value as string) ?? flatMapChildren(child.props?.children)
			: ''
	)
}

export function useScrollToHash() {
	const location = useLocation()

	useEffect(() => {
		const { hash } = location
		if (hash) {
			const id = hash.replace('#', '')
			const element = document.getElementById(id)
			if (!element) {
				return
			}
			element.scrollIntoView()
		}
	}, [location])
}

export function HeadingWithAnchorLink({
	level,
	children,
}: {
	level: number
	children: React.ReactNode
}) {
	useScrollToHash()
	const { pathname } = useLocation()
	const headingId = flatMapChildren(children)
		.join(' ')
		.toLowerCase()
		.replace(emojiesRegex, '')
		.replace(/:|,/g, '')
		.trim()
		.replace(/\s+/g, '-')

	const childrenWithAnchor = headingId ? (
		<>
			<Link className="anchor-link" to={`${pathname}#${headingId}`}>
				#
			</Link>
			{children}
		</>
	) : (
		children
	)

	return (
		<Heading
			id={headingId}
			level={level}
			css={`
				position: relative;
				.anchor-link {
					display: none;
					position: absolute;
					top: 0;
					left: 0;
					transform: translateX(-100%);
					padding-right: 6px;
					color: var(--lighterTextColor);
					text-decoration: none;
					font-size: 0.8em;
				}
				&:hover .anchor-link {
					display: block;
				}
			`}
		>
			{childrenWithAnchor}
		</Heading>
	)
}

type HeadingProps = {
	level: number
	children: React.ReactNode
} & React.ComponentProps<'h1'>

function Heading({ level, children, ...otherProps }: HeadingProps) {
	return React.createElement(
		level === 1
			? H1
			: level === 2
			? H2
			: level === 3
			? H3
			: level === 4
			? H4
			: level === 5
			? H5
			: H6,
		otherProps,
		children
	)
}

// https://stackoverflow.com/a/41164587/1652064
const emojiesRegex = new RegExp(
	`(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|
[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]
|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|
\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]
|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|
\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|
\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|
\u2935|[\u2190-\u21ff])`.replace(/\r?\n/g, ''),
	'g'
)
