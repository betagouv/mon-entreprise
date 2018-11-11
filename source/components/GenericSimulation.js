import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import Targets from 'Components/Targets'
import './GenericSimulation.css'

@withColours
@connect(state => ({
	previousAnswers: state.conversationSteps.foldedSteps
}))
export default class YO extends React.Component {
	state = {
		displayAnswers: false
	}
	render() {
		let colours = this.props.colours
		return (
			<div className="ui__ container" id="GenericSimulation">
				<h1>Quel est l'impact de vos douches ? </h1>
				{!isEmpty(this.props.previousAnswers) && (
					<button
						style={{ background: colours.colour, color: colours.textColour }}
						onClick={() => this.setState({ displayAnswers: true })}>
						Mes réponses
					</button>
				)}

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
