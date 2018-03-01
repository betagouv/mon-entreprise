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

export let salaries = ['salaire net', 'salaire de base', 'salaire total']
let popularTargetNames = [...salaries, 'aides employeur']

@reduxForm({
	form: 'conversation'
})
@connect(
	state => ({
		getTargetValue: dottedName =>
			formValueSelector('conversation')(state, dottedName),
		targets: state.analysis ? state.analysis.targets : [],
		targetNames: state.targetNames
	}),
	dispatch => ({
		startConversation: (targetNames, fromScratch = false) =>
			dispatch({ type: 'START_CONVERSATION', targetNames, fromScratch })
	})
)
export default class TargetSelection extends Component {
	state = {
		activeInput: null,
		affinage: false
	}

	componentWillMount() {
		this.props.startConversation(popularTargetNames)
	}
	render() {
		if (this.props.targets.length == 0) return null

		return (
			<section id="targetSelection">
				<h1>Entrez un salaire mensuel</h1>
				{this.renderOutputList()}

				{this.state.activeInput && (
					<div id="action">
						{this.state.affinage ? (
							!this.props.conversationVisible && (
								<p style={{ color: this.props.colours.textColourOnWhite }}>
									Cochez un ou plusieurs objectifs
								</p>
							)
						) : (
							<BlueButton
								onClick={() =>
									console.log('iozn') || this.setState({ affinage: true })
								}
							>
								Affiner
							</BlueButton>
						)}
					</div>
				)}
			</section>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(curry(findRuleByName)(rules)),
			{
				targets,
				targetNames,
				textColourOnWhite,
				startConversation
			} = this.props,
			optionIsChecked = s => targetNames.includes(s.name),
			visibleCheckbox = s =>
				this.state.affinage && s.dottedName !== this.state.activeInput,
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
										onClick={() =>
											console.log('iazdo') || this.props.showConversation()
										}
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
									{visibleCheckbox(s) ? (
										optionIsChecked(s) ? (
											<i
												className="fa fa-check-square-o fa-2x"
												style={{ color: textColourOnWhite }}
											/>
										) : (
											<i
												className="fa fa-square-o fa-2x"
												style={{ color: '#4b4b66' }}
											/>
										)
									) : null}
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
										<span
											className="targetValue"
											style={{ width: '6em' }}
											onClick={() =>
												this.setState({ activeInput: s.dottedName })
											}
										>
											{do {
												let rule = this.props.targets.find(
														propEq('dottedName', s.dottedName)
													),
													value = rule && rule.nodeValue
												;<RuleValue value={value} />
											}}
										</span>
									)}
								</span>
							</div>
							<p
								style={
									optionIsChecked(s)
										? { color: textColourOnWhite }
										: { color: '#4b4b66' }
								}
							>
								{s['résumé']}
							</p>
						</div>
					))}
				</div>
			</div>
		)
	}
}
