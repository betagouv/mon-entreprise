import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import Targets from 'Components/Targets'
import './GenericSimulation.css'
import { nextStepsSelector } from 'Selectors/analyseSelectors'

@withColours
@connect(state => ({
	previousAnswers: state.conversationSteps.foldedSteps,
	noNextSteps: nextStepsSelector(state).length == 0
}))
export default class YO extends React.Component {
	state = {
		displayAnswers: false
	}
	render() {
		let { colours, noNextSteps, previousAnswers } = this.props
		console.log(noNextSteps)
		return (
			<div className="ui__ container" id="GenericSimulation">
				<h1>Quel est l'impact de vos douches ? </h1>
				{!isEmpty(previousAnswers) && (
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
				{noNextSteps && (
					<>
						<h2>Plus de questions ! </h2>
						<p>Vous avez atteint l'estimation la plus précise.</p>
					</>
				)}
				<Targets />
			</div>
		)
	}
}
