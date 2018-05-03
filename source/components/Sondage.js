import React, { Component } from 'react'
import './Sondage.css'
import { connect } from 'react-redux'
import Smiley from './SatisfactionSmiley'
import TypeFormEmbed from './TypeFormEmbed'
import Overlay from './Overlay'

@connect(state => ({
	targets: state.analysis ? state.analysis.targets : [],
	activeInput: state.activeTargetInput
}))
export default class extends Component {
	state = { visible: true, modal: false }
	onSmileyClick = satisfaction => this.setState({ modal: true, satisfaction })

	render() {
		let { activeInput, targets } = this.props,
			{ satisfaction, modal, visible } = this.state

		if (!(activeInput && targets.length)) return null
		if (!visible) return null
		return (
			<div id="sondage">
				<Smiley text=":)" hoverColor="#16a085" onClick={this.onSmileyClick} />
				<Smiley text=":|" hoverColor="#f39c12" onClick={this.onSmileyClick} />
				<button onClick={() => this.setState({ visible: false })}>X</button>
				{modal && (
					<Overlay onOuterClick={() => this.setSate({ modal: false })}>
						<TypeFormEmbed
							hiddenVariables={{ exterieur: false, satisfaction }}
						/>
					</Overlay>
				)}
			</div>
		)
	}
}
