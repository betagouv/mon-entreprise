import classNames from 'classnames'
import Explicable from 'Components/conversation/Explicable'
import { compose } from 'ramda'
import React, { Component } from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { change, Field } from 'redux-form'
import IgnoreStepButton from './IgnoreStepButton'

export let buildValidationFunction = valueType => {
	let validator = valueType ? valueType.validator : {},
		{ pre = v => v, test = () => true, error } = validator
	return v => v != undefined && (test(pre(v)) ? undefined : error)
}
/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export var FormDecorator = formType => RenderField =>
	compose(
		connect(
			//... this helper directly to the redux state to avoid passing more props
			state => ({
				themeColours: state.themeColours,
				flatRules: state.flatRules
			}),
			dispatch => ({
				stepAction: (name, step, source) =>
					dispatch({ type: 'STEP_ACTION', name, step, source }),
				setFormValue: (field, value) =>
					dispatch(change('conversation', field, value))
			})
		),
		withNamespaces()
	)(
		class extends Component {
			state = {
				helpVisible: false
			}
			render() {
				let {
					stepAction,
					valueType,
					defaultValue,
					fieldName,
					inversion,
					setFormValue,
					themeColours
				} = this.props
				let validate = buildValidationFunction(valueType)
				let submit = cause => stepAction('fold', fieldName, cause),
					stepProps = {
						...this.props,
						submit,
						validate,
						setFormValue: (value, name = fieldName) => setFormValue(name, value)
					}

				return (
					<div className={classNames('step', formType)}>
						<div className="unfoldedHeader">
							<div className="step-question">
								<h1>
									{' '}
									{this.props.question}{' '}
									{!inversion && <Explicable dottedName={fieldName} />}
								</h1>
							</div>
						</div>
						{defaultValue != null && (
							<IgnoreStepButton
								action={() => {
									setFormValue(
										fieldName,
										typeof defaultValue == 'object'
											? JSON.stringify(defaultValue)
											: '' + defaultValue
									)
									submit('ignore')
								}}
							/>
						)}
						<fieldset>
							<Field
								component={RenderField}
								name={fieldName}
								{...stepProps}
								themeColours={themeColours}
							/>
						</fieldset>
					</div>
				)
			}
		}
	)
