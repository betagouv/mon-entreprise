import React, { Component } from 'react'
import './Sondage.css'
import { connect } from 'react-redux'
import Smiley from './SatisfactionSmiley'

@connect(state => ({
	targets: state.analysis ? state.analysis.targets : [],
	activeInput: state.activeTargetInput
}))
export default class extends Component {
	onSmileyClick() {}
	render() {
		let { activeInput, targets } = this.props

		if (!(activeInput && targets.length)) return null
		return (
			<div id="sondage">
				<Smiley text=":)" hoverColor="#16a085" clicked={this.onSmileyClick} />
				<Smiley text=":|" hoverColor="#f39c12" clicked={this.onSmileyClick} />
				<button>X</button>
			</div>
		)
	}
}
