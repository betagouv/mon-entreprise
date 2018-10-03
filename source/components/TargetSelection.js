import classNames from 'classnames'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { encodeRuleName, findRuleByDottedName } from 'Engine/rules'
import { propEq } from 'ramda'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { change, Field, formValueSelector, reduxForm } from 'redux-form'
import {
	analysisWithDefaultsSelector,
	blockingInputControlsSelector,
	flatRulesSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import { mainTargetNames } from '../config'
import AnimatedTargetValue from './AnimatedTargetValue'
import Controls from './Controls'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import ProgressCircle from './ProgressCircle'
import './TargetSelection.css'

let salaries = [
	'contrat salarié . salaire . total',
	'contrat salarié . salaire . brut de base',
	'contrat salarié . salaire . net à payer'
]

let displayedTargetNames = [...salaries, 'contrat salarié . aides employeur']
export let popularTargetNames = [
	...displayedTargetNames,
	'contrat salarié . rémunération . net imposable'
]

@translate()
@reduxForm({
	form: 'conversation',
	destroyOnUnmount: false
})
@withRouter
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
class TargetSelection extends Component {
	render() {
		let { colours, noUserInput, blockingInputControls } = this.props
		return (
			<div id="targetSelection">
				<section
					id="targetsContainer"
					style={{
						color: colours.textColour,
						background: `linear-gradient(
							60deg,
							${colours.darkColour} 0%,
							${colours.colour} 100%
						)`
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
			</div>
		)
	}

	renderOutputList() {
		let displayedTargets = mainTargetNames.map(target =>
				findRuleByDottedName(this.props.flatRules, target)
			),
			{
				conversationStarted,
				activeInput,
				setActiveInput,
				analysis,
				noUserInput,
				blockingInputControls,
				match
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
										match,
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
	blockingInputControls,
	match
}) => {
	return (
		<span className="header">
			{conversationStarted &&
				!blockingInputControls && (
					<ProgressCircle target={target} isActiveInput={isActiveInput} />
				)}

			<span className="texts">
				{!conversationStarted &&
					target.dottedName.includes('net après impôt') && (
						<div>
							<span id="labelNew">
								<Trans>Janvier 2019</Trans>
							</span>
						</div>
					)}
				<span className="optionTitle">
					<Link to={match.path + 'règle/' + encodeRuleName(target.dottedName)}>
						{target.title || target.name}
					</Link>
				</span>
				{!conversationStarted && <p>{target['résumé']}</p>}
			</span>
		</span>
	)
}

let CurrencyField = withColours(props => {
	return (
		<CurrencyInput
			style={{
				color: props.colours.textColour,
				borderColor: props.colours.textColour
			}}
			className="targetInput"
			autoFocus
			{...props.input}
			{...props}
		/>
	)
})

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
			{target.dottedName.includes('rémunération . total') && <AidesGlimpse />}
		</span>
	)
)
@connect(
	null,
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
			<div
				className={classNames({
					editable: target.question,
					attractClick:
						target.question && (noUserInput || blockingInputControls)
				})}
				tabIndex="0"
				onClick={this.showField(value)}
				onFocus={this.showField(value)}>
				<AnimatedTargetValue value={value} />
			</div>
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

@withColours
@connect(state => ({ analysis: analysisWithDefaultsSelector(state) }))
class AidesGlimpse extends Component {
	render() {
		let targets = this.props.analysis.targets,
			aides =
				targets &&
				targets.find(t => t.dottedName === 'contrat salarié . aides employeur')
		if (!aides || !aides.nodeValue) return null
		return (
			<div id="aidesGlimpse">
				{' '}
				- <AnimatedTargetValue value={aides.nodeValue} />{' '}
				<Link
					to={'/règle/' + encodeRuleName('contrat salarié . aides employeur')}
					style={{ color: this.props.colours.textColour }}>
					<Trans>d'aides</Trans> {emoji(aides.icon)}
				</Link>
			</div>
		)
	}
}

export default TargetSelection
