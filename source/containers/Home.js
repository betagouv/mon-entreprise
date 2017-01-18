import React, { Component } from 'react'
import './Home.css'
import {searchRules} from '../model.js'
import {Link} from 'react-router'

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
			<section id="description">
				<p>
				Les règles des taxes et cotisations sur le travail <em>lisibles</em> par un humain et <em>interprétables</em> par un programme.
				</p>
				<p id="about"><Link to="/a-propos">En savoir plus</Link></p>
			</section>
			<section id="search">
				<input
					placeholder="chercher par ex. retraite"
					onChange={e => this.setState({userSearch: e.target.value})}
					/>
			</section>
			<section id="search-results">
				<ul>
				{this.state.userSearch != null &&
					searchRules(this.state.userSearch)
						.map(({type, name, rule}) =>
							// console.log(rule) ||
							<li key={name}>
								<span className="rule-type">
									{type}
								</span>
								<span className="rule-name">
									<Link to={`/regle/${name}`}>{name}</Link>
								</span>
							</li>
						)
				}</ul>
			</section>
		</div>)
	}
}
