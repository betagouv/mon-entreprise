import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import './InputSuggestions.css'

@withColours
@translate()
export default class InputSuggestions extends Component {
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
					{suggestions.map(
						suggestion => do {
							let { texte: text, valeur: value } =
								typeof suggestion === 'object'
									? suggestion
									: { texte: suggestion, valeur: suggestion }
							;<li
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
						}
					)}
				</ul>
			</div>
		)
	}
}
