import React, { Component } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import { rules } from 'Engine/rules'
import { propEq, reject } from 'ramda'

export default class HomeEmbauche extends Component {
	state = {
		input: 'salaire de base',
		targets: ['salaire net']
	}
	render() {
		let { targets, input } = this.state

		return (
			<div id="home">
				<div id="header">
					<img
						id="marianne"
						src={require('../images/marianne.svg')}
						alt="Un service de l'État français"
					/>
					<h1>Simulateurs d'embauche</h1>
				</div>
				<section id="selection">
					<h2>Que voulez-vous faire ?</h2>
					<p>Choisissez ce que vous allez saisir</p>
					{this.renderInputList()}
					<div id="conversionSymbol">↓</div>
					<p>Choisissez ce que nous allons calculer</p>
					{this.renderOutputList()}
					<Link to={'/simu/' + targets.join('+') + '/' + input}>
						<button>C'est parti !</button>
					</Link>
				</section>
			</div>
		)
	}
	renderInputList() {
		let salaires = rules.filter(propEq('type', 'salaire'))
		return (
			<select
				defaultValue="salaire de base"
				onMouseDown={e => this.setState({ input: e.target.value })}
			>
				{salaires.map(s => (
					<option key={s.name} value={s.name}>
						{s.title || s.name}
					</option>
				))}
			</select>
		)
	}
	renderOutputList() {
		let salaires = rules.filter(propEq('type', 'salaire')),
			{ targets, input } = this.state
		return (
			<select
				multiple
				value={targets}
				onChange={e =>
					this.setState({
						targets: targets.find(t => t === e.target.value)
							? reject(t => t === e.target.value, targets)
							: [...targets, e.target.value]
					})}
			>
				{salaires.map(s => (
					<option key={s.name} value={s.name} disabled={s.name === input}>
						{s.title || s.name}
					</option>
				))}
			</select>
		)
	}
}
