import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'

const languageCodeToEmoji = {
	en: '🇬🇧',
	fr: '🇫🇷'
}

export default withTranslation()(
	class LangSwitcher extends Component {
		getUnusedLanguageCode = () => {
			let languageCode = this.props.i18n.language
			return !languageCode || languageCode === 'fr' ? 'en' : 'fr'
		}

		changeLanguage = () => {
			let nextLanguage = this.getUnusedLanguageCode()
			this.props.i18n.changeLanguage(nextLanguage)
			this.forceUpdate()
		}
		render() {
			const languageCode = this.getUnusedLanguageCode()
			return (
				<button
					className={this.props.className || 'ui__ link-button'}
					onClick={this.changeLanguage}>
					{emoji(languageCodeToEmoji[languageCode])}{' '}
					{languageCode.toUpperCase()}
				</button>
			)
		}
	}
)
