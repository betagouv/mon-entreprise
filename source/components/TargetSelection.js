import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { rules, findRuleByName } from 'Engine/rules'
import {
	reject,
	propEq,
	curry,
	pipe,
	equals,
	filter,
	contains,
	length,
	without,
	append,
	ifElse
} from 'ramda'
import { Link } from 'react-router-dom'
import './TargetSelection.css'
import BlueButton from './BlueButton'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { RuleValue } from './rule/RuleValueVignette'

export let salaries = ['salaire net', 'salaire de base', 'salaire total']
let popularTargetNames = [...salaries, 'aides employeur']

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
		targetNames: state.targetNames
	}),
	dispatch => ({
		startConversation: (targetNames, fromScratch = false) =>
			dispatch({ type: 'START_CONVERSATION', targetNames, fromScratch })
	})
)
export default class TargetSelection extends Component {
	state = {
		activeInput: null
	}

	render() {
		return (
			<>
				<section
					id="targetSelection"
					style={{
						background: this.props.colours.colour,
						color: this.props.colours.textColour
					}}
				>
					{this.renderOutputList()}
				</section>

				{this.state.activeInput ? (
					<div id="action">
						{this.props.selectingTargets ? (
							!this.props.conversationVisible && (
								<p style={{ color: this.props.colours.textColour }}>
									Cochez un ou plusieurs objectifs
								</p>
							)
						) : (
							<>
								<p>Estimation par défaut un CDI non cadre ... </p>
								<BlueButton onClick={this.props.setSelectingTargets}>
									Personnaliser
								</BlueButton>
							</>
						)}
					</div>
				) : (
					<h1>Entrez un salaire mensuel</h1>
				)}
			</>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(curry(findRuleByName)(flatRules)),
			{
				targets,
				targetNames,
				textColourOnWhite,
				startConversation
			} = this.props,
			optionIsChecked = s => targetNames.includes(s.name),
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
											startConversation(
												toggleTarget(s.name)(
													targetNames.filter(
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
								<span className="targetInputOrValue">
									{s.name.includes('salaire') &&
									this.state.activeInput === s.dottedName ? (
										<Field
											name={s.dottedName}
											component="input"
											type="text"
											placeholder="mon salaire"
											autoFocus
										/>
									) : (
										<>
											{this.state.activeInput && (
												<i className="fa fa-calculator" aria-hidden="true" />
											)}
											<span
												className="targetValue"
												style={{ width: '6em' }}
												onClick={() => {
													this.props.startConversation(
														reject(equals(s.name), popularTargetNames)
													)

													this.setState({ activeInput: s.dottedName })
												}}
											>
												{do {
													let rule = this.props.targets.find(
															propEq('dottedName', s.dottedName)
														),
														value = rule && rule.nodeValue
													;<RuleValue value={value} />
												}}
											</span>
										</>
									)}
								</span>
							</div>
							<p
								style={
									optionIsChecked(s)
										? { color: textColourOnWhite }
										: { color: '#4b4b66' }
								}>
								{s['résumé']}
							</p>
						</div>
					))}
				</div>
			</div>
		)
	}
}
