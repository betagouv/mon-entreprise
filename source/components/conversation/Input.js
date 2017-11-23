import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import classnames from 'classnames'
import R from 'ramda'
import {Field} from 'redux-form'


@FormDecorator('input')
export default class Input extends Component {
	state = {
		hoverSuggestion: null
	}
	render() {
		let {
				input,
				stepProps: { name, attributes, submit, valueType },
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
						type="text"
						{...input}
						value={hoverSuggestion != null ? hoverSuggestion : input.value}
						className={classnames({ suffixed })}
						id={'step-' + name}
						{...attributes}
						style={
							!active
								? { border: '2px dashed #ddd' }
								: { border: '1px solid #ddd' }
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
							htmlFor={'step-' + name}
							style={!active ? { color: '#888' } : { color: '#222' }}
						>
							{answerSuffix}
						</label>
					)}
					<button
						className="send"
						disabled={sendButtonDisabled}
						style={{
							color: themeColours.textColour,
							background: themeColours.colour
						}}
						onClick={() => (!sendButtonDisabled && !error ? submit() : null)}
					>
						<span className="text">valider</span>
						<span className="icon">&#10003;</span>
					</button>
				</div>

				{this.renderSuggestions(themeColours)}

				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}

	componentDidMount(){
		let { stepProps: { name, inversion, setFormValue} } = this.props
		if (!inversion) return null
		// initialize the form field in renderinversions
		setFormValue(inversion.inversions[0].dottedName, 'inversions.' + name)
	}
	renderInversions() {
		let { stepProps: { name, inversion} } = this.props
		if (!inversion) return null

		if (inversion.inversions.length === 1) return (
			<span>{inversion.inversions[0].title || inversion.inversions[0].name}</span>
		)

		return (
			<Field
				component="select"
				name={'inversions.' + name}
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
		let { setFormValue, submit, suggestions, input, name, inverted } = this.props.stepProps



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
