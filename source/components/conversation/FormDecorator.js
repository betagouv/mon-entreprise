import classNames from 'classnames'
import Explicable from 'Components/conversation/Explicable'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Field } from 'redux-form'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export const FormDecorator = formType => RenderField =>
	function({ fieldName, question, inversion, unit, ...otherProps }) {
		const dispatch = useDispatch()
		const submit = source =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: fieldName,
				source
			})
		const setFormValue = (fieldName, value) => {
			dispatch({ type: 'UPDATE_SITUATION', fieldName, value })
			dispatch(change('conversation', fieldName, value))
		}

		const stepProps = {
			...otherProps,
			submit,
			...(unit === '%'
				? {
						format: x => (x == null ? null : +(x * 100).toFixed(2)),
						normalize: x => (x == null ? null : x / 100)
				  }
				: {})
		}

		return (
			<div className={classNames('step', formType)}>
				<div className="unfoldedHeader">
					<h3>
						{question} {!inversion && <Explicable dottedName={fieldName} />}
					</h3>
				</div>

				<fieldset>
					<Field
						component={RenderField}
						name={fieldName}
						setFormValue={(value, name = fieldName) =>
							setFormValue(name, value)
						}
						onChange={(evt, value) => {
							dispatch({ type: 'UPDATE_SITUATION', fieldName, value })
						}}
						{...stepProps}
					/>
				</fieldset>
			</div>
		)
	}
