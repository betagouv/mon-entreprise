import React, { Component } from 'react'
import './InputSuggestions.css'
import withColours from '../withColours'
import { toPairs } from 'ramda'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

@withColours
@translate()
export default class extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	state = { suggestion: null }
	render() {
		let {
				suggestions,
				onSecondClick,
				onFirstClick,
				colouredBackground,
				colours
			} = this.props,
			{ i18n } = this.context

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
							<span title={i18n.t('cliquez pour insérer cette suggestion')}>
								{text}
							</span>
						</li>
					))}
				</ul>
			</div>
		)
	}
}
