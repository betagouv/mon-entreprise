import React, { Component } from 'react'
import { rules } from 'Engine/rules'
import { propEq, reject } from 'ramda'
import { Link } from 'react-router-dom'

export default class TargetSelection extends Component {
	state = {
		targets: ['salaire net', 'coût du travail']
	}
	render() {
		let { targets } = this.state

		return (
			<section id="selection">
				<h2>Que voulez-vous faire ?</h2>
				<p>Choisissez un ou plusieurs objectifs de calcul</p>
				{this.renderOutputList()}
				{targets.length !==0 && (
					<Link to={'/simu/' + targets.join('+')}>
						<button>Valider</button>
					</Link>
				)}
			</section>
		)
	}

	renderOutputList() {
		let salaires = rules.filter(propEq('type', 'salaire')),
			{ targets } = this.state
		return (
			<select
				multiple
				value={targets}
				onMouseDown={e =>
					this.setState({
						targets: targets.find(t => t === e.target.value)
							? reject(t => t === e.target.value, targets)
							: [...targets, e.target.value]
					})
				}
			>
				{salaires.map(s => (
					<option key={s.name} value={s.name}>
						{s.title || s.name}
					</option>
				))}
			</select>
		)
	}
}
