import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'

@FormDecorator('text-area')
export default class Input extends Component {
	render() {
		let {
				name,
				input,
				stepProps: { submit, attributes },
				meta: { touched, error },
				themeColours
			} = this.props,
			inputError = touched && error,
			sendButtonDisabled = !input.value || inputError

		return (
			<span>
				<span className="answer">
					<textarea
						{...attributes}
						{...input}
						id={'step-' + name}
						onKeyDown={({ key, ctrlKey }) =>
							key == 'Enter' &&
							ctrlKey &&
							input.value &&
							(!error ? submit() : input.onBlur()) // blur will trigger the error
						}
					/>
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
						<span className="icon">✓</span>
					</button>
				</span>
				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}
}
