import { Emoji } from '@/design-system/emoji'

type Props = {
	children: string
}

export default function TextRenderer({ children }: Props) {
	return <Emoji emoji={children} />
}
