import MarkdownToJsx, { MarkdownToJSX } from 'markdown-to-jsx'

import { Message } from '@/design-system'

import { componentsRendering } from '../componentsRendering'
import { TextRenderer } from './TextRenderer'

export type MarkdownProps = React.ComponentProps<typeof MarkdownToJsx> & {
	className?: string
	components?: MarkdownToJSX.Overrides
	renderers?: Record<string, unknown>
	as?: string
	htmlFor?: string
}

export function Markdown({
	children,
	components = {},
	as,
	htmlFor,
	...otherProps
}: MarkdownProps) {
	return (
		<MarkdownToJsx
			as={as}
			htmlFor={htmlFor}
			options={{
				forceBlock: true,
				...otherProps.options,
				overrides: {
					...componentsRendering,
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
