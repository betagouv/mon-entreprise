import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { FormDecorator } from './FormDecorator'
import classnames from 'classnames'
import { toPairs } from 'ramda'
import SendButton from './SendButton'

@FormDecorator('input')
@translate()
export default class Input extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	state = {
		suggestion: null
	}
	render() {
		let {
				input,
				dottedName,
				submit,
				valueType,
				meta: { dirty, error, active },
				themeColours
			} = this.props,
			answerSuffix = valueType.suffix,
			suffixed = answerSuffix != null,
			inputError = dirty && error,
			submitDisabled = !dirty || inputError,
			{ i18n } = this.context

		return (
			<span>
				<div className="answer">
					<input
						ref={el => {
							this.inputElement = el
						}}
						type="text"
						{...input}
						className={classnames({ suffixed })}
						id={'step-' + dottedName}
						inputMode="numeric"
						placeholder={i18n.t('votre réponse')}
						style={
							!active
								? { border: '2px dashed #ddd' }
								: { border: `1px solid ${themeColours.textColourOnWhite}` }
						}
					/>
					{suffixed && (
						<label
							className="suffix"
							htmlFor={'step-' + dottedName}
							style={!active ? { color: '#888' } : { color: '#222' }}>
							{answerSuffix}
						</label>
					)}
					<SendButton
						{...{ disabled: submitDisabled, themeColours, error, submit }}
					/>
				</div>

				{this.renderSuggestions(themeColours)}
				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}

	renderSuggestions(themeColours) {
		let { setFormValue, suggestions, inverted } = this.props,
			{ i18n } = this.context

		if (!suggestions || inverted) return null
		return (
			<div className="inputSuggestions">
				suggestions:
				<ul>
					{toPairs(suggestions).map(([text, value]) => (
						<li
							key={value}
							onClick={() => {
								setFormValue('' + value)
								if (this.state.suggestion !== value)
									this.setState({ suggestion: value })
								else this.props.submit('suggestion')
							}}
							style={{ color: themeColours.textColourOnWhite }}>
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
