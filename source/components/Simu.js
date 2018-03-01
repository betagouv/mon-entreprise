import React, { Component } from 'react'
//import styles from './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
import Conversation from './conversation/Conversation'

@withColours
export default class extends Component {
	state = {
		conversationVisible: false
	}
	render() {
		let { colours } = this.props

		return (
			<div>
				{' '}
				<TargetSelection
					colours={colours}
					conversationVisible={this.state.conversationVisible}
					showConversation={() => this.setState({ conversationVisible: true })}
				/>
				{this.state.conversationVisible && (
					<Conversation textColourOnWhite={colours.textColourOnWhite} />
				)}
			</div>
		)
	}
}
