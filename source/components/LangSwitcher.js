import PropTypes from 'prop-types'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'

const languageCodeToEmoji = {
	'en-UK': '🇬🇧',
	'fr-FR': '🇫🇷'
}

@withRouter
@translate()
class LangSwitcher extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	getUnusedLanguageCode = () => {
		let languageCode = this.context.i18n.language
		return !languageCode || languageCode === 'fr-FR' ? 'en-UK' : 'fr-FR'
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
				{emoji(languageCodeToEmoji[languageCode])}{' '}
				{languageCode.slice(0, 2).toUpperCase()}
			</button>
		)
	}
}

export default LangSwitcher
