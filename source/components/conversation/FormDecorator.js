import classNames from 'classnames'
import Explicable from 'Components/conversation/Explicable'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { change, Field } from 'redux-form'

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
	@connect(
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
	)
	@translate()
	class extends Component {
		state = {
			helpVisible: false
		}
		render() {
			let {
				setFormValue,
				stepAction,
				subquestion,
				possibleChoice, // should be found in the question set theoritically, but it is used for a single choice question -> the question itself is dynamic and cannot be input as code,
				valueType,
				fieldName,
				inversion,
				themeColours
			} = this.props

			/* There won't be any answer zone here, widen the question zone */
			let wideQuestion = formType == 'rhetorical-question' && !possibleChoice

			let validate = buildValidationFunction(valueType)

			let submit = cause => stepAction('fold', fieldName, cause),
				stepProps = {
					...this.props,
					submit,
					validate,
					setFormValue: (value, name = fieldName) => setFormValue(name, value)
				}

			let question = (
				<h1
					style={{
						// border: '2px solid ' + this.props.themeColours.colour, // higher border width and colour to emphasize focus
						// background: 'none',
						// color: this.props.themeColours.textColourOnWhite,
						maxWidth: wideQuestion ? '95%' : ''
					}}>
					{this.props.question}
				</h1>
			)

			return (
				<div className={classNames('step', formType)}>
					<div>
						<div className="unfoldedHeader">
							<div className="step-question">
								{inversion ? (
									question
								) : (
									<Explicable dottedName={fieldName}>{question}</Explicable>
								)}
								<div
									className="step-subquestion"
									dangerouslySetInnerHTML={{ __html: subquestion }}
								/>
							</div>
						</div>
						<fieldset>
							<Field
								component={RenderField}
								name={fieldName}
								{...stepProps}
								themeColours={themeColours}
							/>
						</fieldset>
					</div>
				</div>
			)
		}
	}
