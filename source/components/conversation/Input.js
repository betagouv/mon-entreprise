import classnames from 'classnames'
import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

@FormDecorator('input')
@translate()
@withColours
export default class Input extends Component {
	render() {
		let {
				input,
				dottedName,
				submit,
				valueType,
				meta: { dirty, error, active },
				t,
				colours
			} = this.props,
			answerSuffix = valueType.suffix,
			suffixed = answerSuffix != null,
			inputError = dirty && error,
			submitDisabled = !dirty || inputError

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
						placeholder={t('votre réponse')}
						style={
							!active
								? { border: '2px dashed #ddd' }
								: { border: `1px solid ${colours.textColourOnWhite}` }
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
					<SendButton {...{ disabled: submitDisabled, error, submit }} />
				</div>
				<InputSuggestions
					suggestions={this.props.suggestions}
					onFirstClick={value => this.props.setFormValue('' + value)}
					onSecondClick={() => this.props.submit('suggestion')}
				/>
				{inputError && <span className="step-input-error">{error}</span>}
			</span>
		)
	}
}
