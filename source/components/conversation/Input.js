import classnames from 'classnames'
import { Component, React, T } from 'Components'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

export default compose(
	FormDecorator('input'),
	withTranslation(),
	withColours,
	connect(state => ({
		period: formValueSelector('conversation')(state, 'période')
	}))
)(
	class Input extends Component {
		debouncedOnChange = debounce(750, this.props.input.onChange)
		render() {
			let {
					input,
					dottedName,
					submit,
					meta: { dirty, error },
					t,
					colours,
					rulePeriod,
					period,
					unit
				} = this.props,
				suffixed = unit != null,
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
							style={{ border: `1px solid ${colours.textColourOnWhite}` }}
						/>
						{suffixed && (
							<label className="suffix" htmlFor={'step-' + dottedName}>
								{unit}
								{rulePeriod && (
									<span>
										{' '}
										<T>par</T>{' '}
										<T>
											{
												{ mois: 'mois', année: 'an' }[
													rulePeriod === 'flexible' ? period : rulePeriod
												]
											}
										</T>
									</span>
								)}
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
