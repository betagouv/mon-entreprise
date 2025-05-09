import HeadingWithAnchorLink from './HeadingWithAnchorLink'
import Markdown, { MarkdownProps } from './Markdown'

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
