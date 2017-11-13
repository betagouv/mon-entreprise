import React, { Component } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import { rules } from 'Engine/rules'
import { propEq, reject } from 'ramda'

export default class HomeEmbauche extends Component {
	state = {
		input: 'salaire de base'
	}
	render() {
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
					<button>C'est parti !</button>
				</section>
			</div>
		)
	}
	renderInputList() {
		let salaires = rules.filter(propEq('type', 'salaire'))
		return (
			<select onMouseDown={e => this.setState({input: e.target.value})}>
				{salaires.map(s => (
					<option key={s.name} value={s.name} selected={s.name === 'salaire de base'}>
						{s.title || s.name}
					</option>
				))}
			</select>
		)
	}
	renderOutputList() {
		let salaires = rules.filter(propEq('type', 'salaire'))
		return (
			<select multiple onMouseDown={e=>{
				e.preventDefault()
				e.target.selected = !e.target.selected
			}}>
				{salaires.map(s => (
					<option key={s.name} value={s.name} disabled={s.name === this.state.input}>
						{s.title || s.name}
					</option>
				))}
			</select>
		)
	}
}
