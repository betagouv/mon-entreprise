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
	length
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
		targets: state.analysis ? state.analysis.targets : []
	}),
	dispatch => ({
		startConversation: (targetNames, fromScratch = false) =>
			dispatch({ type: 'START_CONVERSATION', targetNames, fromScratch })
	})
)
export default class TargetSelection extends Component {
	state = {
		targets: [],
		activeInput: null
	}

	componentWillMount() {
		this.props.startConversation(popularTargetNames)
	}
	render() {
		let { targets } = this.state,
			ready = targets.length > 0

		console.log('yayayay', this.props.targets)

		if (this.props.targets.length == 0) return null

		return (
			<section id="targetSelection">
				<h1>Entrez un salaire mensuel</h1>
				{this.renderOutputList()}

				{false && (
					<div id="action">
						<p style={{ color: this.props.colours.textColourOnWhite }}>
							Vous pouvez faire plusieurs choix
						</p>
						<Link to={'/simu/' + targets.join('+')}>
							<BlueButton disabled={!ready}>Valider</BlueButton>
						</Link>
					</div>
				)}
			</section>
		)
	}

	renderOutputList() {
		let popularTargets = popularTargetNames.map(curry(findRuleByName)(rules)),
			{ targets } = this.state,
			textColourOnWhite = this.props.colours.textColourOnWhite,
			// You can't select 3 salaries, as one must be an input in the next step
			optionDisabled = name =>
				contains('salaire', name) &&
				pipe(
					reject(equals(name)),
					filter(contains('salaire')),
					length,
					equals(2)
				)(targets),
			optionIsChecked = s => targets.includes(s.name)

		return (
			<div>
				<div id="targets">
					{popularTargets.map(s => (
						<div key={s.name}>
							<input
								id={s.name}
								type="checkbox"
								disabled={optionDisabled(s.name)}
								checked={optionIsChecked(s)}
								onChange={() =>
									this.setState({
										targets: targets.find(t => t === s.name)
											? reject(t => t === s.name, targets)
											: [...targets, s.name]
									})
								}
							/>
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
								<div>
									<span className="optionTitle">{s.title || s.name}</span>
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
							</label>
							{s.name.includes('salaire') &&
							this.state.activeInput === s.dottedName ? (
								<Field
									name={s.dottedName}
									component="input"
									type="text"
									placeholder="mon salaire"
								/>
							) : (
								<span
									style={{ width: '6em' }}
									onClick={() => this.setState({ activeInput: s.dottedName })}
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
						</div>
					))}
				</div>
			</div>
		)
	}
}
