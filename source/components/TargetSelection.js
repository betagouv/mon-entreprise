import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import formValueTypes from 'Components/conversation/formValueTypes'
import { findRuleByName } from 'Engine/rules'
import { propEq, curry } from 'ramda'
import './TargetSelection.css'
import BlueButton from './BlueButton'
import { Field, reduxForm, formValueSelector, change } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RuleValue } from './rule/RuleValueVignette'
import classNames from 'classnames'
import ProgressCircle from './ProgressCircle/index'
import { buildValidationFunction } from './conversation/FormDecorator'
export let salaries = ['salaire total', 'salaire de base', 'salaire net']
export let popularTargetNames = [...salaries, 'aides employeur']

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
		let { targets, conversationStarted, colours, activeInput } = this.props
		this.firstEstimationComplete = activeInput && targets.length > 0
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
				{!this.firstEstimationComplete && (
					<h1>
						<Trans i18nKey="enterSalary">Entrez un salaire mensuel</Trans>
					</h1>
				)}

				{this.firstEstimationComplete &&
					!conversationStarted && (
						<div id="action">
							<p>
								<b>
									<Trans>Estimation approximative</Trans>
								</b>{' '}
								<br />
								<Trans i18nKey="defaults">
									pour une situation par défaut (CDI non cadre).
								</Trans>
							</p>
							<BlueButton onClick={this.props.startConversation}>
								<Trans>Affiner le calcul</Trans>
							</BlueButton>
						</div>
					)}
			</div>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(
				curry(findRuleByName)(this.props.flatRules)
			),
			{ conversationStarted, activeInput, setActiveInput, targets } = this.props

		return (
			<div>
				<ul id="targets">
					{popularTargets.map(target => (
						<li key={target.name}>
							<Header
								{...{
									target,
									conversationStarted,
									isActiveInput: activeInput === target.dottedName
								}}
							/>
							<TargetInputOrValue
								{...{
									target,
									targets,
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

let Header = ({ target, conversationStarted, isActiveInput }) => {
	return (
		<span className="header">
			{conversationStarted && (
				<ProgressCircle target={target} isActiveInput={isActiveInput} />
			)}

			<span className="texts">
				<span className="optionTitle">
					<Link to={'/règle/' + target.dottedName}>
						{target.title || target.name}
					</Link>
				</span>
				{!conversationStarted && <p>{target['résumé']}</p>}
			</span>
		</span>
	)
}

let validate = buildValidationFunction(formValueTypes['euros'])
let InputComponent = ({ input, meta: { dirty, error } }) => (
	<span>
		{dirty && error && <span className="input-error">{error}</span>}
		<input type="number" {...input} autoFocus />
	</span>
)
let TargetInputOrValue = ({
	target,
	targets,
	firstEstimationComplete,
	activeInput,
	setActiveInput
}) => (
	<span className="targetInputOrValue">
		{activeInput === target.dottedName ? (
			<Field
				name={target.dottedName}
				component={InputComponent}
				type="text"
				validate={validate}
			/>
		) : (
			<TargetValue {...{ targets, target, activeInput, setActiveInput }} />
		)}
		{(firstEstimationComplete || target.question) && (
			<span className="unit">€</span>
		)}
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
		let {
				targets,
				target,
				setFormValue,
				activeInput,
				setActiveInput
			} = this.props,
			targetWithValue = targets.find(propEq('dottedName', target.dottedName)),
			value = targetWithValue && targetWithValue.nodeValue,
			humanValue = value != null && value.toFixed(0)

		return (
			<span
				className={classNames({
					editable: target.question,
					attractClick: target.question && targets.length === 0
				})}
				onClick={() => {
					if (!target.question) return
					if (value != null) {
						setFormValue(target.dottedName, humanValue + '')
						setFormValue(activeInput, '')
					}

					setActiveInput(target.dottedName)
				}}>
				<RuleValue value={value} />
			</span>
		)
	}
}
