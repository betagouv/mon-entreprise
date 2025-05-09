import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx'
import { styled } from 'styled-components'

import { Message } from '@/design-system'
import { Strong, U } from '@/design-system/typography'
import { H1, H2, H3, H4, H5, H6 } from '@/design-system/typography/heading'
import { Li, Ol, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import LinkRenderer from './LinkRenderer'
import TextRenderer from './TextRenderer'

export type MarkdownProps = React.ComponentProps<typeof MarkdownToJsx> & {
	className?: string
	components?: MarkdownToJSX.Overrides
	renderers?: Record<string, unknown>
	as?: string
}

export default function Markdown({
	children,
	components = {},
	as,
	...otherProps
}: MarkdownProps) {
	return (
		<MarkdownToJsx
			as={as}
			options={{
				forceBlock: true,
				...otherProps.options,
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
					ol: Ol,
					li: Li,
					code: Code,
					pre: Pre,
					span: TextRenderer,
					blockquote: (props) => (
						<Message type="info" border={false} icon {...props} />
					),
					...components,
				},
			}}
		>
			{children ?? ''}
		</MarkdownToJsx>
	)
}

const Code = styled.code`
	overflow: auto;
	padding: 0.25rem;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[300]};
	color: inherit;
	border-radius: 0.25rem;
`

const Pre = styled.pre`
	overflow: auto;
	padding: 0.5rem;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[600]
			: theme.colors.extended.grey[300]};
	color: inherit;
	border-radius: 0.25rem;

	& ${Code} {
		overflow: initial;
		padding: 0;
		background-color: initial;
		color: inherit;
		border-radius: initial;
	}
`
