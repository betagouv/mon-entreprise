import React, { Component } from 'react'
import { rules, findRuleByName } from 'Engine/rules'
import { reject, curry, pipe, equals, filter, contains, length } from 'ramda'
import { Link } from 'react-router-dom'
import './TargetSelection.css'

export let salaries = ['salaire net', 'salaire de base', 'salaire total']

export default class TargetSelection extends Component {
	state = {
		targets: []
	}
	render() {
		let { targets } = this.state

		return (
			<section id="targetSelection">
				<h1>Que voulez-vous calculer ?</h1>
				{this.renderOutputList()}
				<div
					id="action"
					style={{ visibility: !targets.length ? 'hidden' : 'visible' }}
				>
					<p>Vous pouvez faire plusieurs choix</p>
					<Link to={'/simu/' + targets.join('+')}>
						<button className="blueButton">Valider</button>
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
			// You can't select 3 salaries, as one must be an input in the next step
			optionDisabled = name => contains('salaire', name) && pipe(
				reject(equals(name)),
				filter(contains('salaire')),
				length,
				equals(2)
			)(targets)

		return (
			<div>
				<div id="targets">
					{popularTargets.map(s => (
						<div key={s.name}>
							<input
								id={s.name}
								type="checkbox"
								disabled={optionDisabled(s.name)}
								checked={targets.includes(s.name)}
								onChange={() =>
									this.setState({
										targets: targets.find(t => t === s.name)
											? reject(t => t === s.name, targets)
											: [...targets, s.name]
									})
								}
							/>
							<label htmlFor={s.name} key={s.name}>
								<i className="fa fa-square-o fa-2x" />
								<i className="fa fa-check-square-o fa-2x" />
								<div>
									<span className="optionTitle">{s.title || s.name}</span>
									<p>{s['résumé']}</p>
								</div>
							</label>
						</div>
					))}
				</div>
			</div>
		)
	}
}
