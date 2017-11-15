import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import classnames from 'classnames'
import R from 'ramda'

@FormDecorator('input')
export default class Input extends Component {
	state = {
		hoverSuggestion: null
	}
	render() {
		let {
				name,
				input,
				stepProps: { attributes, submit, valueType },
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
				<span className="answer">
					{this.renderInversions()}
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
						style={{
							visibility: sendButtonDisabled ? 'hidden' : 'visible',
							color: themeColours.textColour,
							background: themeColours.colour
						}}
						onClick={() => (!error ? submit() : null)}
					>
						<span className="text">valider</span>
						<span className="icon">&#10003;</span>
					</button>
				</span>

				{this.renderSuggestions(themeColours)}

				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}
	renderInversions() {
		let { stepProps: { name: inputName, inversions } } = this.props
		if (!inversions) return null

		return (
			<select
				value={this.props.name}
				onChange={e => this.inverse(e.target.value)}
			>
				{inversions.map(({ name, title, dottedName }) => (
					<option key={dottedName} value={dottedName}>
						{title || name}
					</option>
				))}
			</select>
		)
	}
	inverse(inversionName) {
		this.props.changeFieldName(inversionName)
	}
	renderSuggestions(themeColours) {
		let { setFormValue, submit, suggestions, input } = this.props.stepProps
		if (!suggestions) return null
		return (
			<span className="inputSuggestions">
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
			</span>
		)
	}
}
