import React, { Component } from 'react'
import './Pages.css'
import './Home.css'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import TargetSelection from '../TargetSelection'
import Header from './Header'


export default class Home extends Component {

	render() {

		return (
			<div id="home" className="page">
				<Header/>
				<h1>Simulateurs d'embauche</h1>
				<p>LE SLOGAN ICI</p>

				<div id="content">
					<TargetSelection />
				</div>
			</div>
		)
	}

}
