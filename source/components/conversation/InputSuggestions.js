import withColours from 'Components/utils/withColours'
import { compose, toPairs } from 'ramda'
import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import './InputSuggestions.css'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

export default compose(
	withColours,
	withI18n(),
	connect(state => ({
		period: formValueSelector('conversation')(state, 'période')
	}))
)(
	class InputSuggestions extends Component {
		state = { suggestion: null }
		render() {
			let {
				suggestions,
				onSecondClick,
				onFirstClick,
				colouredBackground,
				colours,
				t,
				rulePeriod,
				period
			} = this.props

			if (!suggestions) return null
			//TODO all suggestions are defined for a monthly simulation
			if (rulePeriod === 'flexible' && period !== 'mois') return null
			return (
				<div className="inputSuggestions">
					suggestions:
					<ul>
						{toPairs(suggestions).map(([text, value]) => (
							<li
								key={value}
								onClick={() => {
									onFirstClick(value)
									if (this.state.suggestion !== value)
										this.setState({ suggestion: value })
									else onSecondClick && onSecondClick(value)
								}}
								style={{
									color: colouredBackground
										? colours.textColour
										: colours.textColourOnWhite
								}}>
								<span title={t('cliquez pour insérer cette suggestion')}>
									{text}
								</span>
							</li>
						))}
					</ul>
				</div>
			)
		}
	}
)
