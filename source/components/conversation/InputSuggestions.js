import withColours from 'Components/utils/withColours'
import { compose, toPairs } from 'ramda'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import './InputSuggestions.css'

export default compose(
	withColours,
	withTranslation(),
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

			return (
				<div className="inputSuggestions">
					suggestions:
					<ul>
						{toPairs(suggestions).map(([text, value]) => {
							// TODO : ce serait mieux de déplacer cette logique dans le moteur
							const adjustedValue =
								rulePeriod === 'flexible' && period === 'année'
									? value * 12
									: value
							return (
								<li
									key={value}
									onClick={() => {
										onFirstClick(adjustedValue)
										if (this.state.suggestion !== adjustedValue)
											this.setState({ suggestion: adjustedValue })
										else onSecondClick && onSecondClick(adjustedValue)
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
							)
						})}
					</ul>
				</div>
			)
		}
	}
)
