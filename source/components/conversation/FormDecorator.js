import React, { Component } from 'react'
import { Trans } from 'react-i18next'
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
			getCurrentInversion: dottedName =>
				formValueSelector('conversation')(state, 'inversions.' + dottedName)
		}),
		dispatch => ({
			stepAction: (name, step, source) => dispatch(stepAction(name, step, source)),
			setFormValue: (field, value) =>
				dispatch(change('conversation', field, value))
		})
	)
	class extends Component {
		state = {
			helpVisible: false
		}
		render() {
			let { unfolded } = this.props,
				{ helpText } = this.props.step

			return (
				<div className={classNames({ step: unfolded }, formType)}>
					{this.state.helpVisible && this.renderHelpBox(helpText)}
					<div
						style={{
							visibility: this.state.helpVisible ? 'hidden' : 'visible'
						}}
					>
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
				step: {
					subquestion,
					possibleChoice, // should be found in the question set theoritically, but it is used for a single choice question -> the question itself is dynamic and cannot be input as code,
					defaultValue,
					valueType
				},
				fieldName,
				inversion,
				inverted,
				themeColours
			} = this.props

			/* Nos propriétés personnalisées à envoyer au RenderField.
			Elles sont regroupées dans un objet précis pour pouvoir être enlevées des
			props passées à ce dernier, car React 15.2 n'aime pas les attributes inconnus
			des balises html, <input> dans notre cas.
			*/
			//TODO hack, enables redux-form/CHANGE to update the form state before the traverse functions are run
			let submit = (cause) => setTimeout(() => stepAction('fold', fieldName, cause), 1),
				stepProps = {
					...this.props.step,
					inverted,
					submit,
					setFormValue: (value, name = fieldName) => setFormValue(name, value)
				}

			/* There won't be any answer zone here, widen the question zone */
			let wideQuestion = formType == 'rhetorical-question' && !possibleChoice

			let { pre = v => v, test, error } = valueType ? valueType.validator : {},
				validate = test && (v => (v && test(pre(v)) ? undefined : error))

			let question = (
				<h1
					style={{
						// border: '2px solid ' + this.props.themeColours.colour, // higher border width and colour to emphasize focus
						// background: 'none',
						// color: this.props.themeColours.textColourOnWhite,
						maxWidth: wideQuestion ? '95%' : ''
					}}
				>
					{path(['props', 'step', 'inversion', 'question'])(this) ||
						this.props.step.question}
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
							stepProps={stepProps}
							themeColours={themeColours}
							validate={validate}
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
				step: { title, dottedName },
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
						<span><Trans>Modifier</Trans></span>
					</button>
					{}
				</div>
			)
		}

		renderHelpBox(helpText) {
			let helpComponent =
				typeof helpText === 'string' ? <p>{helpText}</p> : helpText

			return (
				<div className="help-box">
					<a
						className="close-help"
						onClick={() => this.setState({ helpVisible: false })}
					>
						<span className="close-text">
							<Trans>revenir</Trans> <span className="icon">&#x2715;</span>
						</span>
					</a>
					{helpComponent}
				</div>
			)
		}
	}
