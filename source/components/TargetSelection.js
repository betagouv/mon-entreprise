import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { findRuleByName } from 'Engine/rules'
import { propEq, curry } from 'ramda'
import './TargetSelection.css'
import BlueButton from './BlueButton'
import { Field, reduxForm, formValueSelector, change } from 'redux-form'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RuleValue } from './rule/RuleValueVignette'
import classNames from 'classnames'
import ProgressCircle from './ProgressCircle/ProgressCircle'
import withLanguage from './withLanguage'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import CurrencyInput from './CurrencyInput/CurrencyInput'
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
							<div className="main">
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
							</div>
							{activeInput === target.dottedName &&
								!conversationStarted && (
									<InputSuggestions
										suggestions={target.suggestions}
										onFirstClick={value =>
											this.props.setFormValue(target.dottedName, '' + value)
										}
										colouredBackground={true}
									/>
								)}
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

let CurrencyField = props => {
	return (
		<CurrencyInput
			className="targetInput"
			autoFocus
			{...props.input}
			{...props}
		/>
	)
}

let TargetInputOrValue = withLanguage(
	({ target, targets, activeInput, setActiveInput, language }) => (
		<span className="targetInputOrValue">
			{activeInput === target.dottedName ? (
				<Field
					name={target.dottedName}
					component={CurrencyField}
					language={language}
				/>
			) : (
				<TargetValue {...{ targets, target, activeInput, setActiveInput }} />
			)}
		</span>
	)
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
			value = targetWithValue && targetWithValue.nodeValue
		return (
			<span
				className={classNames({
					editable: target.question,
					attractClick: target.question && targets.length === 0
				})}
				onClick={() => {
					if (!target.question) return
					if (value != null) {
						setFormValue(target.dottedName, Math.floor(value) + '')
						setFormValue(activeInput, '')
					}
					setActiveInput(target.dottedName)
				}}>
				<RuleValue value={value} />
			</span>
		)
	}
}
