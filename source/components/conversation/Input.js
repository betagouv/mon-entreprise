import classnames from 'classnames'
import { T } from 'Components'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { useCallback } from 'react'
import { usePeriod } from 'Selectors/analyseSelectors'
import { debounce } from '../../utils'
import { FormDecorator } from './FormDecorator'
import InputSuggestions from './InputSuggestions'
import SendButton from './SendButton'

export default compose(
	FormDecorator('input'),
	withColours
)(function Input({
	suggestions,
	setFormValue,
	submit,
	rulePeriod,
	dottedName,
	value,
	format,
	colours,
	unit
}) {
	const period = usePeriod()
	const debouncedSetFormValue = useCallback(debounce(750, setFormValue), [])
	const suffixed = unit != null

	return (
		<>
			<div css="width: 100%">
				<InputSuggestions
					suggestions={suggestions}
					onFirstClick={value => {
						setFormValue(value)
					}}
					onSecondClick={() => submit('suggestion')}
					rulePeriod={rulePeriod}
				/>
			</div>

			<div className="answer">
				<input
					type="text"
					key={value}
					autoFocus
					value={format(value)}
					onChange={evt => {
						debouncedSetFormValue(evt.target.value)
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
				<SendButton {...{ disabled: value === undefined, submit }} />
			</div>
		</>
	)
})
