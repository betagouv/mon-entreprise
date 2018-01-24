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
				stepProps: { dottedName, attributes, submit, valueType },
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
						{...attributes}
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

		let { stepProps: { dottedName, inversion, setFormValue } } = this.props
		if (!inversion) return null
		// initialize the form field in renderinversions
		setFormValue(inversion.inversions[0].dottedName, 'inversions.' + dottedName)
	}
	renderInversions() {
		let { stepProps: { dottedName, inversion, setFormValue } } = this.props
		if (!inversion) return null

		if (inversion.inversions.length === 1)
			return (
				<span>
					{inversion.inversions[0].title || inversion.inversions[0].dottedName}
				</span>
			)

		return (
			// This field is handled by redux-form : it will set in the state what's
			// the current inversion
			<Field
				component="select"
				name={'inversions.' + dottedName}
				onChange={(e, newValue, previousFieldName) =>
					setFormValue('', previousFieldName)
				}
			>
				{inversion.inversions.map(({ name, title, dottedName }) => (
					<option key={dottedName} value={dottedName}>
						{title || name}
					</option>
				))}
			</Field>
		)
	}
	renderSuggestions(themeColours) {
		let { setFormValue, suggestions, inverted } = this.props.stepProps

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
								else this.props.stepProps.submit()
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
