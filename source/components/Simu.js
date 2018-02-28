import React, { Component } from 'react'
//import styles from './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'

@withColours
export default class extends Component {
	render() {
		return (
			<div>
				{' '}
				<TargetSelection colours={this.props.colours} />
			</div>
		)
	}
}
