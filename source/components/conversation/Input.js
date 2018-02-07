import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import classnames from 'classnames'
import { toPairs } from 'ramda'
import { Field } from 'redux-form'
import SendButton from './SendButton'

@FormDecorator('input')
export default class Input extends Component {
	state = {
		lastValue: ''
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
			submitDisabled = !dirty || inputError

		return (
			<span>
				<div className="inputPrefix">{this.renderInversions()}</div>
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
						placeholder="votre réponse"
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
							style={!active ? { color: '#888' } : { color: '#222' }}
						>
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

	componentDidMount() {
		this.inputElement.focus()
	}
	renderSuggestions(themeColours) {
		let { setFormValue, suggestions, inverted } = this.props

		if (!suggestions || inverted) return null
		return (
			<div className="inputSuggestions">
				suggestions:
				<ul>
					{toPairs(suggestions).map(([text, value]) => (
						<li
							key={value}
							onClick={() => {
								this.setState({ lastValue: null })
								setFormValue('' + value)
								if (this.state.suggestion !== value)
									this.setState({ suggestion: value })
								else this.props.submit('suggestion')
							}}
							onMouseOver={() => {
								this.setState({ lastValue: this.props.input.value })
								setFormValue('' + value)
							}}
							onMouseOut={() =>
								this.state.lastValue != null &&
								setFormValue('' + this.state.lastValue)
							}
							style={{ color: themeColours.textColourOnWhite }}
						>
							<span title="cliquez pour insérer cette suggestion">{text}</span>
						</li>
					))}
				</ul>
			</div>
		)
	}
}
