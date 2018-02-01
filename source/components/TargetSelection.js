import React, { Component } from 'react'
import { rules, findRuleByName } from 'Engine/rules'
import { reject, curry, pipe, equals, filter, contains, length } from 'ramda'
import { Link } from 'react-router-dom'
import './TargetSelection.css'
import BlueButton from './BlueButton'

export let salaries = ['salaire net', 'salaire brut', 'salaire total']

export default class TargetSelection extends Component {
	state = {
		targets: []
	}
	render() {
		let { targets } = this.state,
			ready = targets.length > 0

		return (
			<section id="targetSelection">
				<h1>Que voulez-vous calculer ?</h1>
				{this.renderOutputList()}
				<div id="action">
					<p style={{ color: this.props.themeColours.textColourOnWhite }}>
						Vous pouvez faire plusieurs choix
					</p>
					<Link to={'/simu/' + targets.join('+')}>
						<BlueButton disabled={!ready}>Valider</BlueButton>
					</Link>
				</div>
			</section>
		)
	}

	renderOutputList() {
		let popularTargets = [...salaries, 'aides employeur différées'].map(
				curry(findRuleByName)(rules)
			),
			{ targets } = this.state,
			textColourOnWhite = this.props.themeColours.textColourOnWhite,
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
						</div>
					))}
				</div>
			</div>
		)
	}
}
