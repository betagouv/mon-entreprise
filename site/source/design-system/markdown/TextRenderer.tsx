import { Emoji } from '../emoji'

type TextRendererProps = {
	children: string
}

export const TextRenderer = ({ children }: TextRendererProps) => (
	<Emoji emoji={children} />
)
