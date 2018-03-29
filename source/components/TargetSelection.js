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

@translate()
@reduxForm({
	form: 'conversation'
})
@connect(
	state => ({
		getTargetValue: dottedName =>
			formValueSelector('conversation')(state, dottedName),
		targets: state.analysis ? state.analysis.targets : [],
		flatRules: state.flatRules,
		conversationStarted: state.conversationStarted,
		missingVariablesByTarget: state.missingVariablesByTarget
	}),
	dispatch => ({
		setFormValue: (field, name) =>
			dispatch(change('conversation', field, name)),
		startConversation: () => dispatch({ type: 'START_CONVERSATION' })
	})
)
export default class TargetSelection extends Component {
	state = {
		activeInput: null
	}

	render() {
		let { targets, conversationStarted, colours } = this.props
		this.firstEstimationComplete = this.state.activeInput && targets.length > 0
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
						Entrez un salaire mensuel{' '}
						<i
							style={{ color: colours.textColourOnWhite }}
							className="fa fa-calendar"
							aria-hidden="true"
						/>
					</h1>
				)}

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
			{ textColourOnWhite, missingVariablesByTarget } = this.props

		return (
			<div>
				<ul id="targets">
					{popularTargets.map(s => (
						<li key={s.name}>
							<span>BLOB</span>
							<span className="texts">
								<span className="optionTitle">
									<Link to={'/règle/' + s.dottedName}>{s.title || s.name}</Link>
								</span>
								<p>
									{ s['résumé'] }
									{ values(
										missingVariablesByTarget[s.dottedName] || {}
										).length
									}
								</p>
							</span>
							<TargetInputOrValue
								{...{
									s,
									targets: this.props.targets,
									firstEstimationComplete: this.firstEstimationComplete,
									activeInput: this.state.activeInput,
									setActiveInput: name => this.setState({ activeInput: name }),
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
