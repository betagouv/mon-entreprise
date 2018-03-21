import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import formValueTypes from 'Components/conversation/formValueTypes'
import { rules, findRuleByName } from 'Engine/rules'
import { propEq, contains, without, curry, append, ifElse } from 'ramda'
import './TargetSelection.css'
import BlueButton from './BlueButton'
import { Field, reduxForm, formValueSelector } from 'redux-form'
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
		flatRules: state.flatRules
		conversationTargetNames: state.conversationTargetNames
	}),
	dispatch => ({
		setConversationTargets: (targetNames, fromScratch = false) =>
			dispatch({ type: 'SET_CONVERSATION_TARGETS', targetNames, fromScratch })
	})
)
export default class TargetSelection extends Component {
	state = {
		activeInput: null
	}

	render() {
		this.firstEstimationComplete =
			this.state.activeInput && this.props.targets.length > 0
		return (
			<div id="targetSelection">
				{!this.firstEstimationComplete && <h1>Entrez un salaire mensuel</h1>}
				<section
					id="targetsContainer"
					style={{
						background: this.props.colours.colour,
						color: this.props.colours.textColour
					}}
				>
					{this.renderOutputList()}
				</section>

				{this.firstEstimationComplete && (
					<div id="action">
						{this.props.selectingTargets ? (
							!this.props.conversationVisible && (
								<p>Que voulez-vous affiner ?</p>
							)
						) : (
							<>
								<p>Estimation par défaut pour un CDI non cadre ... </p>
								<BlueButton
									onClick={() => {
										this.props.setSelectingTargets()
									}}
								>
									Personnaliser
								</BlueButton>
							</>
						)}
					</div>
				)}
			</div>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(curry(findRuleByName)(flatRules)),
			{
				conversationTargetNames,
				textColourOnWhite,
				setConversationTargets
			} = this.props,
			optionIsChecked = s => (conversationTargetNames || []).includes(s.name),
			visibleCheckbox = s =>
				this.props.selectingTargets && s.dottedName !== this.state.activeInput,
			toggleTarget = target =>
				ifElse(contains(target), without(target), append(target))

		return (
			<div>
				<div id="targets">
					{popularTargets.map(s => (
						<div key={s.name}>
							<div className="main">
								{visibleCheckbox(s) && (
									<input
										id={s.name}
										type="checkbox"
										checked={optionIsChecked(s)}
										onClick={() => this.props.showConversation()}
										onChange={() =>
											setConversationTargets(
												toggleTarget(s.name)(
													conversationTargetNames.filter(
														t => !this.state.activeInput.includes(t)
													)
												)
											)
										}
									/>
								)}
								<label
									htmlFor={s.name}
									key={s.name}
									style={
										optionIsChecked(s)
											? {
													color: textColourOnWhite
											  }
											: {}
									}
								>
									{
										<span
											style={{
												visibility: visibleCheckbox(s) ? 'visible' : 'hidden'
											}}
										>
											{optionIsChecked(s) ? (
												<i
													className="fa fa-check-square-o fa-2x"
													style={{ color: textColourOnWhite }}
												/>
											) : (
												<i
													className="fa fa-square-o fa-2x"
													style={{ color: '#4b4b66' }}
												/>
											)}
										</span>
									}
									<span className="optionTitle">{s.title || s.name}</span>
								</label>
								<TargetOrInputValue
									{...{
										s,
										targets: this.props.targets,
										firstEstimationComplete: this.firstEstimationComplete,
										activeInput: this.state.activeInput,
										setActiveInput: name => this.setState({ activeInput: name })
									}}
								/>
							</div>
							<p>{s['résumé']}</p>
						</div>
					))}
				</div>
			</div>
		)
	}
}

let InputComponent = ({ input, meta: { dirty, error } }) => (
	<span>
		<input type="text" {...input} autoFocus />

		{dirty && error && <span className="step-input-error">{error}</span>}
	</span>
)
let TargetOrInputValue = ({
	s,
	targets,
	firstEstimationComplete,
	activeInput,
	setActiveInput
}) => (
	<span className="targetInputOrValue">
		{activeInput === s.dottedName ? (
			<Field name={s.dottedName} component={InputComponent} type="text" />
		) : (
			<>
				<span
					className={classNames({
						editable: s.question,
						attractClick: s.question && targets.length === 0
					})}
					onClick={() => {
						s.question && setActiveInput(s.dottedName)
					}}
				>
					{do {
						let rule = targets.find(propEq('dottedName', s.dottedName)),
							value = rule && rule.nodeValue
						;<RuleValue value={value} />
					}}
				</span>
			</>
		)}
		{(firstEstimationComplete || s.question) && <span className="unit">€</span>}
	</span>
)

/* 
				validate={buildValidationFunction(formValueTypes['euros'])}
						*/
