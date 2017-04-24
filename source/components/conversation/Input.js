import React, {Component} from 'react'
import {FormDecorator} from './FormDecorator'
import classnames from 'classnames'
import R from 'ramda'

@FormDecorator('input')
export default class Input extends Component {
	state = {
		suggestedInput: false
	}
	render() {
		let {
			name,
			input,
			stepProps: {attributes, submit, valueType, suggestions, setFormValue},
			meta: {
				touched, error, active,
			},
			themeColours,

		} = this.props,
			answerSuffix = valueType.suffix,
			suffixed = answerSuffix != null,
			inputError = touched && error,
			sendButtonDisabled = this.state.suggestedInput || !input.value || inputError

		return (
			<span>
				<span className="answer">
					<input
						type="text" {...input}
						className={classnames({suffixed})}
						id={'step-' + name}
						{...attributes}
						style={!active ? {border: '2px dashed #ddd'} : {border: '1px solid #ddd'}}
						onKeyDown={({key}) =>
							key == 'Enter' && input.value && (
							!error ?
								submit() :
								input.onBlur() // blur will trigger the error
						)}
						/>
					{ suffixed &&
						<label className="suffix" htmlFor={'step-' + name} style={!active ? {color: '#888'} : {color: '#222'}}>
							{answerSuffix}
						</label>
					}
					<button className="send" style={{visibility: sendButtonDisabled ? 'hidden' : 'visible', color: themeColours.textColour, background: themeColours.colour}}
						onClick={() => !error ? submit() : null} >
						<span className="text">valider</span>
						<span className="icon">&#10003;</span>
					</button>
				</span>
				{suggestions && <span className="input-suggestions">suggestions:
					<ul>
					{R.toPairs(suggestions).map(([text, value]) =>
						<li key={value}
							onClick={e => setFormValue(value) && submit() && e.preventDefault()}
							onMouseOver={() => setFormValue(value) && this.setState({suggestedInput: true})}
							onMouseOut={() => setFormValue('') && this.setState({suggestedInput: false})}>
							<a href="#" title="cliquer pour valider">{text}</a>
						</li>
					)}
					</ul>
				</span>
				}
				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}
}
