import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {Field, change} from 'redux-form'
import {stepAction} from '../../actions'
import StepAnswer from './StepAnswer'
import {capitalise0} from '../../utils'

/*
This higher order component wraps "Form" components (e.g. Question.js), that represent user inputs,
with a header, click actions and more goodies.

Read https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
to understand those precious higher order components.
*/

export var FormDecorator = formType => RenderField =>
	@connect( //... this helper directly to the redux state to avoid passing more props
		state => ({
			themeColours: state.themeColours
		}),
		dispatch => ({
			stepAction: (name, step) => dispatch(stepAction(name, step)),
			setFormValue: (field, value) => dispatch(change('conversation', field, value))
		})
	)
	class extends Component {
		state = {
			helpVisible: false
		}
		render() {
			let {
				stepAction,
				themeColours,
				setFormValue,
				/* Une étape déjà répondue est marquée 'folded'. Dans ce dernier cas, un résumé
				de la réponse est affiché */
				unfolded
			} = this.props,
				{
				name,
				possibleChoice, // should be found in the question set theoritically, but it is used for a single choice question -> the question itself is dynamic and cannot be input as code,
				// formerly in conversation-steps
				valueType,
				attributes,
				choices,
				optionsURL,
				human,
				helpText,
				suggestions,
				subquestion
			} = this.props.step
			this.step = this.props.step

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
				submit: () => setTimeout(() => stepAction('fold', name), 1),
				setFormValue: value => setFormValue(name, value),
				valueType,
				suggestions,
				subquestion
			}

			/* There won't be any answer zone here, widen the question zone */
			let wideQuestion = formType == 'rhetorical-question' && !possibleChoice

			let {pre = (v => v), test, error} = valueType ? valueType.validator : {},
				validate = test && ( v =>
					( v && test(pre(v)) ) ? undefined : error
				)
			return (
			<div
				className={classNames({step: unfolded}, formType)}
				>
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
									validate={validate}
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
				<span className="form-header">
				{ unfolded ? this.renderQuestion(unfolded, helpText, wideQuestion, subquestion) : this.renderTitleAndAnswer(valueType, human)}
				</span>
			)
		}

		renderQuestion = (unfolded, helpText, wideQuestion, subquestion) =>
				<div className="step-question">
					<h1
						style={{
							// border: '2px solid ' + this.props.themeColours.colour, // higher border width and colour to emphasize focus
							// background: 'none',
							// color: this.props.themeColours.textColourOnWhite,
							maxWidth: wideQuestion ? '95%' : ''
						}}
						>{this.props.step.question}</h1>
						<div className="step-subquestion" dangerouslySetInnerHTML={{__html: subquestion}}></div>
				</div>

		renderTitleAndAnswer(valueType, human) {
			let {
				name,
				stepAction,
				answer,
				themeColours,
				step: {title}
			} = this.props,
				ignored = this.step.state === 'ignored'
			return (
				<div className="foldedQuestion">
					<span className="borderWrapper">
						<span className="title">{capitalise0(title)}</span>
						<span className="answer">
							{answer}
						</span>
					</span>
					<button
						className="edit"
						onClick={() => stepAction('unfold', name)}
						style={{color: themeColours.textColourOnWhite}} >
						<i
							className="fa fa-pencil-square-o"
							aria-hidden="true"
							>
						</i>
						{'  '}
						<span>Modifier</span>
					</button>
					{/* <StepAnswer	{...{value, human, valueType, ignored, themeColours}} /> */}
				</div>)
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
