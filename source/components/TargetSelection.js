import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import formValueTypes from 'Components/conversation/formValueTypes'
import { rules, findRuleByName } from 'Engine/rules'
import { propEq, path, contains, without, curry, append, ifElse } from 'ramda'
import './TargetSelection.css'
import BlueButton from './BlueButton'
import { Field, reduxForm, formValueSelector, change } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RuleValue } from './rule/RuleValueVignette'
import classNames from 'classnames'
import { buildValidationFunction } from './conversation/FormDecorator'
export let salaries = ['salaire total', 'salaire de base', 'salaire net']
export let popularTargetNames = [...salaries, 'aides employeur']
import { Circle } from 'rc-progress'

@translate()
@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@connect(
	state => ({
		getTargetValue: dottedName =>
			formValueSelector('conversation')(state, dottedName),
		targets: state.analysis ? state.analysis.targets : [],
		flatRules: state.flatRules,
		conversationStarted: state.conversationStarted,
		missingVariablesByTarget: state.missingVariablesByTarget,
		activeInput: state.activeTargetInput
	}),
	dispatch => ({
		setFormValue: (field, name) =>
			dispatch(change('conversation', field, name)),
		startConversation: () => dispatch({ type: 'START_CONVERSATION' }),
		setActiveInput: name => dispatch({ type: 'SET_ACTIVE_TARGET_INPUT', name })
	})
)
export default class TargetSelection extends Component {
	render() {
		let { targets, conversationStarted, colours } = this.props
		this.firstEstimationComplete = this.props.activeInput && targets.length > 0
		return (
			<div id="targetSelection">
				<section
					id="targetsContainer"
					style={{
						background: colours.colour,
						color: colours.textColour
					}}>
					{this.renderOutputList()}
				</section>
				{!this.firstEstimationComplete && <h1>Entrez un salaire mensuel </h1>}

				{this.firstEstimationComplete &&
					!conversationStarted && (
						<div id="action">
							<p>
								<b>Estimation approximative</b> <br /> pour une situation par
								défaut (CDI non cadre).
							</p>
							<BlueButton onClick={this.props.startConversation}>
								Affiner le calcul
							</BlueButton>
						</div>
					)}
			</div>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(
				curry(findRuleByName)(flatRules)
			),
			{
				missingVariablesByTarget,
				conversationStarted,
				activeInput,
				setActiveInput
			} = this.props

		return (
			<div>
				<ul id="targets">
					{popularTargets.map(s => (
						<li key={s.name}>
							<Header
								{...{
									conversationStarted,
									s,
									missingVariablesByTarget,
									activeInput
								}}
							/>
							<TargetInputOrValue
								{...{
									s,
									targets: this.props.targets,
									firstEstimationComplete: this.firstEstimationComplete,
									activeInput,
									setActiveInput,
									setFormValue: this.props.setFormValue
								}}
							/>
						</li>
					))}
				</ul>
			</div>
		)
	}
}

let Header = ({
	conversationStarted,
	s,
	missingVariablesByTarget,
	activeInput
}) => (
	<span className="header">
		{conversationStarted && (
			<span
				className="progressCircle"
				style={{
					visibility: activeInput === s.dottedName ? 'hidden' : 'visible'
				}}
			>
				{do {
					let mv = missingVariablesByTarget[s.dottedName],
						number = mv && mv.missingVariables.length,
						ratio = number / 16
					ratio === 0 ? (
						<i className="fa fa-check" aria-hidden="true" />
					) : (
						<Circle
							percent={100 - ratio * 100}
							strokeWidth="15"
							strokeColor="#5de662"
							trailColor="#fff"
							trailWidth="5"
						/>
					)
				}}
			</span>
		)}

		<span className="texts">
			<span className="optionTitle">
				<Link to={'/règle/' + s.dottedName}>{s.title || s.name}</Link>
			</span>
			{!conversationStarted && <p>{s['résumé']}</p>}
		</span>
	</span>
)

let validate = buildValidationFunction(formValueTypes['euros'])
let InputComponent = ({ input, meta: { dirty, error } }) => (
	<span>
		{dirty && error && <span className="input-error">{error}</span>}
		<input type="number" {...input} autoFocus />
	</span>
)
let TargetInputOrValue = ({
	s,
	targets,
	firstEstimationComplete,
	activeInput,
	setActiveInput,
	clearFormValue
}) => (
	<span className="targetInputOrValue">
		{activeInput === s.dottedName ? (
			<Field
				name={s.dottedName}
				component={InputComponent}
				type="text"
				validate={validate}
			/>
		) : (
			<TargetValue {...{ targets, s, activeInput, setActiveInput }} />
		)}
		{(firstEstimationComplete || s.question) && <span className="unit">€</span>}
	</span>
)

@connect(
	() => ({}),
	dispatch => ({
		setFormValue: (field, name) => dispatch(change('conversation', field, name))
	})
)
class TargetValue extends Component {
	render() {
		let { targets, s, setFormValue, activeInput, setActiveInput } = this.props,
			rule = targets.find(propEq('dottedName', s.dottedName)),
			value = rule && rule.nodeValue,
			humanValue = value != null && value.toFixed(0)

		return (
			<span
				className={classNames({
					editable: s.question,
					attractClick: s.question && targets.length === 0
				})}
				onClick={() => {
					if (!s.question) return
					if (value != null) {
						setFormValue(s.dottedName, humanValue + '')
						setFormValue(activeInput, '')
					}

					setActiveInput(s.dottedName)
				}}>
				<RuleValue value={value} />
			</span>
		)
	}
}
