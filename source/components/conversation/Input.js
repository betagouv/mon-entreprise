import classnames from 'classnames'
import { React, T } from 'Components'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

export default compose(
	FormDecorator('input'),
	withColours,
	connect(state => ({
		period: formValueSelector('conversation')(state, 'période')
	}))
)(function Input({
	input,
	suggestions,
	setFormValue,
	submit,
	rulePeriod,
	dottedName,
	meta: { dirty, error },
	colours,
	period,
	unit
}) {
	const debouncedOnChange = debounce(750, input.onChange)
	let suffixed = unit != null,
		inputError = dirty && error,
		submitDisabled = !dirty || inputError

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => setFormValue('' + value)}
					onSecondClick={() => submit('suggestion')}
					rulePeriod={rulePeriod}
				/>
			</div>

			<div className="answer">
				<input
					type="text"
					key={input.value}
					autoFocus
					defaultValue={input.value}
					onChange={e => {
						e.persist()
						debouncedOnChange(e)
					}}
					className={classnames({ suffixed })}
					id={'step-' + dottedName}
					inputMode="numeric"
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

			{inputError && <span className="step-input-error">{error}</span>}
		</>
	)
})
