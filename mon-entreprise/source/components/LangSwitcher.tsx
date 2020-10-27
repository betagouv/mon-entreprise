import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'

const languageCodeToEmoji = {
	en: '🇬🇧',
	fr: '🇫🇷'
}

export default function LangSwitcher({ className }: { className: string }) {
	const { i18n } = useTranslation()
	const languageCode = i18n.language
	const unusedLanguageCode =
		!languageCode || languageCode === 'fr' ? 'en' : 'fr'
	const changeLanguage = () => {
		i18n.changeLanguage(unusedLanguageCode)
	}
	return (
		<button
			className={className ?? 'ui__ link-button'}
			onClick={changeLanguage}
		>
			{emoji(languageCodeToEmoji[languageCode as 'fr' | 'en'])}{' '}
			{languageCode.toUpperCase()}
		</button>
	)
}
