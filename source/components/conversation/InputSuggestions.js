import withColours from 'Components/utils/withColours'
import { compose, toPairs } from 'ramda'
import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import './InputSuggestions.css'

export default compose(
	withColours,
	withI18n()
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
				t
			} = this.props

			if (!suggestions) return null
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
