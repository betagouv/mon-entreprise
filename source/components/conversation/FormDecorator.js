import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {Field, change} from 'redux-form'
import {stepAction} from '../../actions'
import StepAnswer from './StepAnswer'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export var FormDecorator = formType => RenderField =>
	@connect( //... this helper directly to the redux state to avoid passing more props
		state => ({
			steps: state.steps,
			answers: state.form.conversation && state.form.conversation.values,
			themeColours: state.themeColours
		}),
		dispatch => ({
			stepAction: (name, newState) => dispatch(stepAction(name, newState)),
			setFormValue: (field, value) => dispatch(change('conversation', field, value))
		})
	)
	class extends Component {
		state = {
			helpVisible: false
		}
		render() {
			let {
				name,
				visible,
				steps,
				stepAction,
				possibleChoice, // should be found in the question set theoritically, but it is used for a single choice question -> the question itself is dynamic and cannot be input as code,
				themeColours,
				// formerly in conversation-steps
				valueType,
				attributes,
				choices,
				optionsURL,
				human,
				helpText,
				suggestions,
				setFormValue,
				subquestion
			} = this.props

			this.step = steps.find(s => s.name == name)

			/* La saisie peut être cachée car ce n'est pas encore son tour,
			ou parce qu'elle a déjà été remplie. Dans ce dernier cas, un résumé
			de la réponse est affiché */
			let stepState = this.step.state,
				completed = stepState && stepState != 'editing',
				unfolded = !completed

			if (!visible) return null

			/* Nos propriétés personnalisées à envoyer au RenderField.
			Elles sont regroupées dans un objet précis pour pouvoir être enlevées des
			props passées à ce dernier, car React 15.2 n'aime pas les attributes inconnus
			des balises html, <input> dans notre cas.
			*/
			let stepProps = {
				attributes, /* Input component's html attributes */
				choices,  /* Question component's radio choices */
				optionsURL, /* Select component's data source */
				possibleChoice, /* RhetoricalQuestion component's only choice :'-( */
				//TODO hack, enables redux-form/CHANGE to update the form state before the traverse functions are run
				submit: () => setTimeout(() => stepAction(name, 'filled'), 1),
				setFormValue: value => setFormValue(name, value),
				valueType,
				suggestions,
				subquestion
			}

			/* There won't be any answer zone here, widen the question zone */
			let wideQuestion = formType == 'rhetorical-question' && !possibleChoice

			return (
			<div className={classNames('step', {unfolded}, formType)} >
				{this.state.helpVisible && this.renderHelpBox(helpText)}
				<div style={{visibility: this.state.helpVisible ? 'hidden' : 'visible'}}>
					{this.renderHeader(unfolded, valueType, human, helpText, wideQuestion, subquestion)}
					{unfolded &&
							<fieldset>
								<Field
									component={RenderField}
									name={name}
									stepProps={stepProps}
									themeColours={themeColours}
									/>
							</fieldset>
					}
				</div>
			</div>
			)
		}

		/*
			< Le titre de ma question > ----------- < (? bulle d'aide) OU résultat >
		*/
		renderHeader(unfolded, valueType, human, helpText, wideQuestion, subquestion) {
			return (
				<span className="form-header" >
				{ unfolded ? this.renderQuestion(unfolded, helpText, wideQuestion, subquestion) : this.renderTitleAndAnswer(valueType, human)}
				</span>
			)
		}

		renderQuestion = (unfolded, helpText, wideQuestion, subquestion) =>
				<span className="step-question">
					<h1
						style={{
							// border: '2px solid ' + this.props.themeColours.colour, // higher border width and colour to emphasize focus
							// background: 'none',
							// color: this.props.themeColours.textColourOnWhite,
							maxWidth: wideQuestion ? '95%' : ''
						}}
						>{this.props.question}</h1>
						<div className="step-subquestion" dangerouslySetInnerHTML={{__html: subquestion}}></div>
				</span>

		renderTitleAndAnswer(valueType, human) {
			let {
				name,
				stepAction,
				answers,
				themeColours
			} = this.props,
				value = answers[name],
				ignored = this.step.state === 'ignored'

			return (
				<span onClick={() => stepAction(name, 'editing')}>
					<h1>{this.props.title}</h1>
						<StepAnswer	{...{value, human, valueType, ignored, themeColours}} />
				</span>)
		}

		renderHelpBox(helpText) {
			let helpComponent =
					typeof helpText === 'string' ?
					(<p>{helpText}</p>) :
					helpText

			return <div className="help-box">
				<a
					className="close-help"
					onClick={() => this.setState({helpVisible: false})}>
					<span className="close-text">revenir <span className="icon">&#x2715;</span></span>
				</a>
				{helpComponent}
			</div>
		}
	}
