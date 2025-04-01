import emojiFn from 'react-easy-emoji'

type PropType = {
	emoji: string
	alt?: string
	title?: string
	'aria-hidden'?: boolean
}

// This custom component has several advantages over the direct use of the
// `emojiFn` provided by `react-easy-emoji` :
// - allow to configure the URL to self host twemoji images in production
// - using a real React component works better with the translation scripts
export function Emoji({ emoji, alt, title, ...props }: PropType) {
	alt = ''

	if (!emoji) {
		return null
	}

	return emojiFn(emoji, {
		baseUrl: '/twemoji/',
		protocol: '' as 'https', // Hack to use relative path
		ext: '.png',
		props: {
			alt,
			title,
			'aria-hidden': props['aria-hidden'] ?? 'true',
			...props,
		},
	})
}
