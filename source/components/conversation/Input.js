import React, {Component} from 'react'
import {FormDecorator} from './FormDecorator'
import classnames from 'classnames'

@FormDecorator('input')
export default class Input extends Component {
	render() {
		let {
			name,
			input,
			stepProps: {attributes, submit, valueType},
			meta: {
				touched, error, active,
			},
			themeColours
		} = this.props,
			answerSuffix = valueType.suffix,
			suffixed = answerSuffix != null,
			inputError = touched && error,
			sendButtonDisabled = !input.value || inputError

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
				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}
}
