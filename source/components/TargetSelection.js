import React, { Component } from 'react'
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
import classNames from 'classnames'

export let salaries = ['salaire total', 'salaire de base', 'salaire net']
export let popularTargetNames = [...salaries, 'aides employeur']

@reduxForm({
	form: 'conversation'
})
@connect(
	state => ({
		getTargetValue: dottedName =>
			formValueSelector('conversation')(state, dottedName),
		targets: state.analysis ? state.analysis.targets : [],
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
		let firstEstimationComplete =
			this.state.activeInput && this.props.targets.length > 0
		return (
			<div id="targetSelection">
				{!firstEstimationComplete && <h1>Entrez un salaire mensuel</h1>}
				<section
					id="targetsContainer"
					style={{
						background: this.props.colours.colour,
						color: this.props.colours.textColour
					}}
				>
					{this.renderOutputList()}
				</section>

				{firstEstimationComplete && (
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
		let popularTargets = popularTargetNames.map(curry(findRuleByName)(rules)),
			{
				targets,
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
								<span className="targetInputOrValue">
									{s.name.includes('salaire') &&
									this.state.activeInput === s.dottedName ? (
										<>
											<Field
												name={s.dottedName}
												component="input"
												type="text"
												placeholder="mon--require  salaire"
												autoFocus
											/>
											{this.props.targets.length > 0 && (
												<i
													className="fa fa-pencil-o valueTypeIcon"
													aria-hidden="true"
												/>
											)}
										</>
									) : (
										<>
											<span
												className={classNames('targetValue', {
													attractClick:
														s.question && this.props.targets.length === 0
												})}
												onClick={() => {
													//													this.props.setConversationTargets(
													//														reject(equals(s.name), popularTargetNames)
													//													)

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
												{this.props.targets.length > 0 && (
													<i
														className="fa fa-calculator valueTypeIcon"
														aria-hidden="true"
													/>
												)}
											</span>
										</>
									)}
								</span>
							</div>
							<p>{s['résumé']}</p>
						</div>
					))}
				</div>
			</div>
		)
	}
}
