import React, { Component } from 'react'
import './Home.css'
import rules from '../load-rules'

console.log('rules', rules.length)

export default class Home extends Component {
	state = {
		userSearch: ''
	}
	render() {

		return (
		<div id="home">
			<section id="brand">
				<img src={require('../images/logo.png')} />
				<span id="name">
					Système <br/>
					Social
				</span>
				<span id="version">alpha</span>
			</section>
			<section id="search">
				<input
					placeholder="ex. retraite"
					onChange={e => this.setState({userSearch: e.target.value})}
					/>
			</section>
			<section id="search-results">
				<ul>
				{this.state.userSearch != null && rules
					.filter( rule =>
						rule && rule.Cotisation &&
						JSON.stringify(rule).indexOf(this.state.userSearch) > -1)
					.map( ({Cotisation}) => console.log(Cotisation) ||
						<li key={Cotisation}>{Cotisation}</li>
					)
				}</ul>
			</section>
		</div>)
	}
}
