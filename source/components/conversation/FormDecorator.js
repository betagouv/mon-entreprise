import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Field, change, formValueSelector } from 'redux-form'
import { stepAction } from '../../actions'
import { capitalise0 } from '../../utils'
import { path } from 'ramda'
import Explicable from 'Components/conversation/Explicable'
import IgnoreStepButton from './IgnoreStepButton'

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
			situationGate: state.situationGate
		}),
		dispatch => ({
			stepAction: (name, step, source) =>
				dispatch(stepAction(name, step, source)),
			setFormValue: (field, value) =>
				dispatch(change('conversation', field, value))
		})
	)
	class extends Component {
		render() {
			let { unfolded } = this.props

			return (
				<div className={classNames({ step: unfolded }, formType)}>
					<div>
						{/* Une étape déjà répondue est marquée 'folded'. Dans ce dernier cas, un résumé
				de la réponse est affiché */}
						{unfolded ? this.renderUnfolded() : this.renderFolded()}
					</div>
				</div>
			)
		}

		renderUnfolded() {
			let {
				setFormValue,
				stepAction,
				subquestion,
				possibleChoice, // should be found in the question set theoritically, but it is used for a single choice question -> the question itself is dynamic and cannot be input as code,
				defaultValue,
				valueType,
				fieldName,
				inversion,
				themeColours
			} = this.props

			/* There won't be any answer zone here, widen the question zone */
			let wideQuestion = formType == 'rhetorical-question' && !possibleChoice

			let validate = buildValidationFunction(valueType)

			let submit = cause =>
					//TODO hack, enables redux-form/CHANGE to update the form state before the traverse functions are run
					setTimeout(() => stepAction('fold', fieldName, cause), 1),
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
					}}
				>
					{path(['props', 'inversion', 'question'])(this) ||
						this.props.question}
				</h1>
			)
			return (
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
						{defaultValue != null && (
							<IgnoreStepButton
								action={() => {
									setFormValue(fieldName, '' + defaultValue)
									submit('ignore')
								}}
							/>
						)}
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
			)
		}

		renderFolded() {
			let {
				stepAction,
				situationGate,
				themeColours,
				title,
				dottedName,
				fieldName,
				fieldTitle
			} = this.props

			let answer = situationGate(fieldName)

			return (
				<div className="foldedQuestion">
					<span className="borderWrapper">
						<span className="title">{capitalise0(fieldTitle || title)}</span>
						<span className="answer">{answer}</span>
					</span>
					<button
						className="edit"
						onClick={() => stepAction('unfold', dottedName, 'unfold')}
						style={{ color: themeColours.textColourOnWhite }}
					>
						<i className="fa fa-pencil" aria-hidden="true" />
						{'  '}
						<span>Modifier</span>
					</button>
					{}
				</div>
			)
		}
	}

export let buildValidationFunction = valueType => {
	let { pre = v => v, test, error } = valueType ? valueType.validator : {}
	return test && (v => (v && test(pre(v)) ? undefined : error))
}
