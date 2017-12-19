import React, { Component } from 'react'
import { rules, findRuleByName } from 'Engine/rules'
import { reject, curry } from 'ramda'
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
			{ targets } = this.state
		return (
			<div>
				<div id="targets">
					{popularTargets.map(s => (
						<div key={s.name}>
							<input
								id={s.name}
								type="checkbox"
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
