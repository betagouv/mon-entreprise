import React, { Component } from 'react'
import './Pages.css'
import './Home.css'
import ReactPiwik from 'Components/Tracker' //TODO réintégrer Piwik
import TargetSelection from '../TargetSelection'


export default class Home extends Component {

	render() {

		return (
			<div id="home" className="page">
				<div id="content">
					<TargetSelection />
				</div>
			</div>
		)
	}

}
