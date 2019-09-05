import withColours from 'Components/utils/withColours'
import { compose, toPairs } from 'ramda'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

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
				t,
				rulePeriod,
				period
			} = this.props

			if (!suggestions) return null

			return (
				<div css="display: flex; align-items: baseline; justify-content: flex-end;">
					<small>Suggestions :</small>

					{toPairs(suggestions).map(([text, value]) => {
						// TODO : ce serait mieux de déplacer cette logique dans le moteur
						const adjustedValue =
							rulePeriod === 'flexible' && period === 'année'
								? value * 12
								: value
						return (
							<button
								className="ui__ link-button"
								key={value}
								css="margin: 0 0.4rem !important"
								onClick={() => {
									onFirstClick(adjustedValue)
									if (this.state.suggestion !== adjustedValue)
										this.setState({ suggestion: adjustedValue })
									else onSecondClick && onSecondClick(adjustedValue)
								}}
								title={t('cliquez pour insérer cette suggestion')}>
								{text}
							</button>
						)
					})}
				</div>
			)
		}
	}
)
