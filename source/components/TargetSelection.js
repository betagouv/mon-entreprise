import InputSuggestions from 'Components/conversation/InputSuggestions'
import { findRuleByDottedName } from 'Engine/rules'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { change, formValueSelector, reduxForm } from 'redux-form'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector,
	noUserInputSelector,
	blockingInputControlsSelector
} from 'Selectors/analyseSelectors'
import BlueButton from './BlueButton'
import ProgressCircle from './ProgressCircle/ProgressCircle'
import './TargetSelection.css'
import Controls from './Controls'
import TargetValue from './TargetValue'

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
		startConversation: () => dispatch({ type: 'START_CONVERSATION' }),
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
						<div id="action">
							<p>
								<b>
									<Trans>Première estimation</Trans>
								</b>
							</p>
							<BlueButton onClick={this.props.startConversation}>
								<Trans>Continuer</Trans>
							</BlueButton>
						</div>
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
				blockingInputControls,
				setFormValue
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
								<TargetValue
									{...{
										target,
										targets,
										activeInput,
										setActiveInput,
										setFormValue,
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
