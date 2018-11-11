import React from 'react'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import Targets from 'Components/Targets'

@withColours
export default class YO extends React.Component {
	state = {
		displayAnswers: false
	}
	render() {
		return (
			<div>
				<button onClick={() => this.setState({ displayAnswers: true })}>
					Mes réponses
				</button>

				{this.state.displayAnswers && (
					<Answers onClose={() => this.setState({ displayAnswers: false })} />
				)}
				<Conversation
					textColourOnWhite={this.props.colours.textColourOnWhite}
				/>
				<Targets />
			</div>
		)
	}
}
