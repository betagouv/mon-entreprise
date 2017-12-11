import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import classnames from 'classnames'
import R from 'ramda'
import { Field } from 'redux-form'
import SendButton from './SendButton'

@FormDecorator('input')
export default class Input extends Component {
	state = {
		hoverSuggestion: null
	}
	render() {
		let {
				input,
				stepProps: { dottedName, attributes, submit, valueType },
				meta: { touched, error, active },
				themeColours
			} = this.props,
			answerSuffix = valueType.suffix,
			suffixed = answerSuffix != null,
			inputError = touched && error,
			{ hoverSuggestion } = this.state,
			sendButtonDisabled =
				input.value == null || input.value == '' || inputError

		return (
			<span>
				<div className="inputPrefix">{this.renderInversions()}</div>
				<div className="answer">
					<input
						ref={el => { this.inputElement = el }}
						type="text"
						{...input}
						value={hoverSuggestion != null ? hoverSuggestion : input.value}
						className={classnames({ suffixed })}
						id={'step-' + dottedName}
						{...attributes}
						style={
							!active
								? { border: '2px dashed #ddd' }
								: { border: '1px solid #2975D1' }
						}
						onKeyDown={
							({ key }) =>
								key == 'Enter' &&
								input.value &&
								(!error ? submit() : input.onBlur())

							// blur will trigger the error
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
						{...{ sendButtonDisabled, themeColours, error, submit }}
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
		let { stepProps: { dottedName, inversion } } = this.props
		if (!inversion) return null

		if (inversion.inversions.length === 1)
			return (
				<span>
					{inversion.inversions[0].title || inversion.inversions[0].dottedName}
				</span>
			)

		return (
			<Field component="select" name={'inversions.' + dottedName}>
				{inversion.inversions.map(({ name, title, dottedName }) => (
					<option key={dottedName} value={dottedName}>
						{title || name}
					</option>
				))}
			</Field>
		)
	}
	renderSuggestions(themeColours) {
		let { setFormValue, submit, suggestions, inverted } = this.props.stepProps

		if (!suggestions || inverted) return null
		return (
			<div className="inputSuggestions">
				suggestions:
				<ul>
					{R.toPairs(suggestions).map(([text, value]) => (
						<li
							key={value}
							onClick={e =>
								setFormValue('' + value) && submit() && e.preventDefault()
							}
							onMouseOver={() => this.setState({ hoverSuggestion: value })}
							onMouseOut={() => this.setState({ hoverSuggestion: null })}
							style={{ color: themeColours.colour }}
						>
							<a href="#" title="cliquer pour valider">
								{text}
							</a>
						</li>
					))}
				</ul>
			</div>
		)
	}
}
