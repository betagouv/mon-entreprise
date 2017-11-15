import React, { Component } from 'react'
import './Home.css'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import TargetSelection from './TargetSelection'


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
				<TargetSelection />
			</div>
		)
	}

}
