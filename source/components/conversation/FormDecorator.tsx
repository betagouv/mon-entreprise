import { updateSituation } from 'Actions/actions'
import Explicable from 'Components/conversation/Explicable'
import { serializeUnit } from 'Engine/units'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/analyseSelectors'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export default function FormDecorator(RenderField) {
	return function FormStep({
		fieldName,
		question,
		inversion,
		unit,
		...otherProps
	}) {
		const dispatch = useDispatch()
		const situation = useSelector(situationSelector)
		const language = useTranslation().i18n.language
		const submit = source =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: fieldName,
				source
			})
		const setFormValue = value => {
			dispatch(updateSituation(fieldName, value))
		}

		return (
			<div className="step">
				<div className="unfoldedHeader">
					<h3>
						{question} {!inversion && <Explicable dottedName={fieldName} />}
					</h3>
				</div>

				<fieldset>
					<RenderField
						{...otherProps}
						name={fieldName}
						value={situation[fieldName]}
						onChange={setFormValue}
						onSubmit={submit}
						unit={serializeUnit(unit, situation[fieldName], language)}
					/>
				</fieldset>
			</div>
		)
	}
}
