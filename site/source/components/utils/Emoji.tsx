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
		language === 'fr'
			? import.meta.env.VITE_FR_BASE_URL
			: import.meta.env.VITE_EN_BASE_URL
	if (!emoji) {
		return null
	}
	return emojiFn(
		emoji,
		import.meta.env.MODE === 'production'
			? {
					baseUrl: siteUrl + '/twemoji/2/',
					ext: '.png',
			  }
			: ({} as any)
	)
}
