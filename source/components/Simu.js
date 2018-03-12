import React, { Component } from 'react'
//import styles from './Simu.css'
import TargetSelection from './TargetSelection'
import withColours from './withColours'
import Conversation from './conversation/Conversation'
import ProgressTip from './ProgressTip'

@withColours
export default class extends Component {
	state = {
		conversationVisible: false,
		selectingTargets: false
	}
	render() {
		let { colours } = this.props,
			{ selectingTargets, conversationVisible } = this.state

		return (
			<div>
				{' '}
				<TargetSelection
					colours={colours}
					conversationVisible={this.state.conversationVisible}
					showConversation={() => this.setState({ conversationVisible: true })}
					selectingTargets={selectingTargets}
					setSelectingTargets={() => this.setState({ selectingTargets: true })}
				/>
				<ProgressTip {...{ selectingTargets, conversationVisible }} />
				{this.state.conversationVisible && (
					<Conversation textColourOnWhite={colours.textColourOnWhite} />
				)}
			</div>
		)
	}
}
