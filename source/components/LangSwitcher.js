import PropTypes from 'prop-types'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'

const languageCodeToEmoji = {
	en: '🇬🇧',
	fr: '🇫🇷'
}

@withRouter
@translate()
class LangSwitcher extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	getUnusedLanguageCode = () => {
		let languageCode = this.context.i18n.language
		return !languageCode || languageCode === 'fr' ? 'en' : 'fr'
	}

	changeLanguage = () => {
		let nextLanguage = this.getUnusedLanguageCode()
		this.context.i18n.changeLanguage(nextLanguage)
		this.forceUpdate()
	}
	render() {
		const languageCode = this.getUnusedLanguageCode()
		return (
			<button
				className={this.props.className || 'ui__ link-button'}
				onClick={this.changeLanguage}>
				{emoji(languageCodeToEmoji[languageCode])} {languageCode.toUpperCase()}
			</button>
		)
	}
}

export default LangSwitcher
