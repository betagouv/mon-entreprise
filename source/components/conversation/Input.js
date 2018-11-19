import classnames from 'classnames'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

export default compose(
	FormDecorator('input'),
	withI18n(),
	withColours
)(
	class Input extends Component {
		debouncedOnChange = debounce(750, this.props.input.onChange)
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
							type="text"
							key={input.value}
							autoFocus
							defaultValue={input.value}
							onChange={e => {
								e.persist()
								this.debouncedOnChange(e)
							}}
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
						rulePeriod={this.props.rulePeriod}
					/>
					{inputError && <span className="step-input-error">{error}</span>}
				</span>
			)
		}
	}
)
