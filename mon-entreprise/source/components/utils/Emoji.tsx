import emojiFn from 'react-easy-emoji'
type PropType = {
	emoji: string
}

export default function Emoji({ emoji }: PropType) {
	return emojiFn(emoji)
}
