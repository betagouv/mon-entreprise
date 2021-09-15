import emojiFn from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
type PropType = {
	emoji: string | undefined
}

// This custom component has several advantages over the direct use of the
// `emojiFn` provided by `react-easy-emoji` :
// - allow to configure the URL to self host twemoji images in production
// - using a real React component works better with the translation scripts
export default function Emoji({ emoji }: PropType) {
	const language = useTranslation().i18n.language

	const siteUrl =
		language === 'fr' ? process.env.FR_BASE_URL : process.env.EN_BASE_URL
	if (!emoji) {
		return null
	}
	return emojiFn(
		emoji,
		process.env.NODE_ENV === 'production'
			? {
					baseUrl: siteUrl + '/twemoji/2/',
					ext: '.png',
			  }
			: ({} as any)
	)
}
