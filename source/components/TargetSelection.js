import classNames from 'classnames'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import { findRuleByDottedName } from 'Engine/rules'
import { propEq } from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { change, Field, formValueSelector, reduxForm } from 'redux-form'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector,
	noUserInputSelector,
	blockingInputControlsSelector
} from 'Selectors/analyseSelectors'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import ProgressCircle from './ProgressCircle/ProgressCircle'
import AnimatedTargetValue from './AnimatedTargetValue'
import './TargetSelection.css'
import withLanguage from './withLanguage'
import Controls from './Controls'

let salaries = [
	'contrat salarié . salaire . total',
	'contrat salarié . salaire . brut de base',
	'contrat salarié . salaire . net à payer'
]

let displayedTargetNames = [...salaries, 'contrat salarié . aides employeur']
export let popularTargetNames = [
	...displayedTargetNames,
	'contrat salarié . salaire . net imposable'
]

@translate()
@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@connect(
	state => ({
		getTargetValue: dottedName =>
			formValueSelector('conversation')(state, dottedName),
		analysis: analysisWithDefaultsSelector(state),
		blockingInputControls: blockingInputControlsSelector(state),
		flatRules: flatRulesSelector(state),
		noUserInput: noUserInputSelector(state),
		conversationStarted: state.conversationStarted,
		activeInput: state.activeTargetInput
	}),
	dispatch => ({
		setFormValue: (field, name) =>
			dispatch(change('conversation', field, name)),
		setActiveInput: name => dispatch({ type: 'SET_ACTIVE_TARGET_INPUT', name })
	})
)
export default class TargetSelection extends Component {
	render() {
		let {
			conversationStarted,
			colours,
			noUserInput,
			blockingInputControls
		} = this.props
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
				{noUserInput && (
					<p className="controls">
						<Trans i18nKey="enterSalary">Entrez un salaire mensuel</Trans>
					</p>
				)}

				{blockingInputControls && (
					<Controls blockingInputControls={blockingInputControls} />
				)}
				{!noUserInput &&
					!blockingInputControls &&
					!conversationStarted && (
						<h3 style={{ textAlign: 'center', color: 'black' }}>
							<b>
								<Trans>Première estimation</Trans>
							</b>
						</h3>
					)}
			</div>
		)
	}

	renderOutputList() {
		let displayedTargets = displayedTargetNames.map(target =>
				findRuleByDottedName(this.props.flatRules, target)
			),
			{
				conversationStarted,
				activeInput,
				setActiveInput,
				analysis,
				noUserInput,
				blockingInputControls
			} = this.props,
			targets = analysis ? analysis.targets : []

		return (
			<div>
				<ul id="targets">
					{displayedTargets.map(target => (
						<li key={target.name}>
							<div className="main">
								<Header
									{...{
										target,
										conversationStarted,
										isActiveInput: activeInput === target.dottedName,
										blockingInputControls
									}}
								/>
								<TargetInputOrValue
									{...{
										target,
										targets,
										activeInput,
										setActiveInput,
										setFormValue: this.props.setFormValue,
										noUserInput,
										blockingInputControls
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

let Header = ({
	target,
	conversationStarted,
	isActiveInput,
	blockingInputControls
}) => {
	return (
		<span className="header">
			{conversationStarted &&
				!blockingInputControls && (
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
	({
		target,
		targets,
		activeInput,
		setActiveInput,
		language,
		noUserInput,
		blockingInputControls
	}) => (
		<span className="targetInputOrValue">
			{activeInput === target.dottedName ? (
				<Field
					name={target.dottedName}
					component={CurrencyField}
					language={language}
				/>
			) : (
				<TargetValue
					{...{
						targets,
						target,
						activeInput,
						setActiveInput,
						noUserInput,
						blockingInputControls
					}}
				/>
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
		let { targets, target, noUserInput, blockingInputControls } = this.props

		let targetWithValue =
				targets && targets.find(propEq('dottedName', target.dottedName)),
			value = targetWithValue && targetWithValue.nodeValue

		return (
			<span
				className={classNames({
					editable: target.question,
					attractClick:
						target.question && (noUserInput || blockingInputControls)
				})}
				tabIndex="0"
				onClick={this.showField(value)}
				onFocus={this.showField(value)}>
				<AnimatedTargetValue value={value} />
			</span>
		)
	}
	showField(value) {
		let { target, setFormValue, activeInput, setActiveInput } = this.props
		return () => {
			if (!target.question) return
			if (value != null) setFormValue(target.dottedName, Math.floor(value) + '')

			if (activeInput) setFormValue(activeInput, '')
			setActiveInput(target.dottedName)
		}
	}
}
