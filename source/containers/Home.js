import React, { Component } from 'react'
import './Home.css'

export default class Home extends Component {
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
				<input placeholder="ex. retraite"/>
			</section>

		</div>)
	}
}
