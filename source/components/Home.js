import React, { Component } from 'react'
import './Home.css'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import TargetSelection from './TargetSelection'
import { slide as Menu } from 'react-burger-menu'
import './Menu.css'

export default class Home extends Component {

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
				<Menu right>
					<a className="menu-item" href="/">À propos</a>
					<a className="menu-item" href="/about">Intégrer le module</a>
					<a className="menu-item" href="/contact">Contribuer</a>
				</Menu>
				<div id="content">
					<TargetSelection />
				</div>
			</div>
		)
	}

}
