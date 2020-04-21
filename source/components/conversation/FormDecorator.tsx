import { updateSituation } from 'Actions/actions'
import Explicable from 'Components/conversation/Explicable'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	parsedRulesSelector,
	situationSelector
} from 'Selectors/analyseSelectors'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export default function FormDecorator(RenderField) {
	return function FormStep({ dottedName }) {
		const dispatch = useDispatch()
		const situation = useSelector(situationSelector)
		const rules = useSelector(parsedRulesSelector)

		const language = useTranslation().i18n.language
		const submit = source =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: dottedName,
				source
			})
		const setFormValue = value => {
			dispatch(updateSituation(dottedName, value))
		}

		return (
			<div className="step">
				<h3>
					{rules[dottedName].question} <Explicable dottedName={dottedName} />
				</h3>

				<fieldset>
					<RenderField
						dottedName={dottedName}
						value={situation[dottedName]}
						onChange={setFormValue}
						onSubmit={submit}
						rules={rules}
					/>
				</fieldset>
			</div>
		)
	}
}
