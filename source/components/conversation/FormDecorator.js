import { updateSituation } from 'Actions/actions'
import classNames from 'classnames'
import Explicable from 'Components/conversation/Explicable'
import { getFormatersFromUnit } from 'Engine/format'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/analyseSelectors'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export const FormDecorator = formType => RenderField =>
	function({ fieldName, question, inversion, unit, ...otherProps }) {
		const dispatch = useDispatch()
		const situation = useSelector(situationSelector)

		const submit = source =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: fieldName,
				source
			})
		const setFormValue = value => {
			dispatch(updateSituation(fieldName, normalize(value)))
		}

		const { format, normalize } = getFormatersFromUnit(unit)
		const value = format(situation[fieldName])

		return (
			<div className={classNames('step', formType)}>
				<div className="unfoldedHeader">
					<h3>
						{question} {!inversion && <Explicable dottedName={fieldName} />}
					</h3>
				</div>

				<fieldset>
					<RenderField
						name={fieldName}
						value={value}
						setFormValue={setFormValue}
						submit={submit}
						format={format}
						unit={unit}
						{...otherProps}
					/>
				</fieldset>
			</div>
		)
	}
