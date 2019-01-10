import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import { compose, isEmpty } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import {
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'

export default compose(
	withColours,
	connect(state => ({
		previousAnswers: state.conversationSteps.foldedSteps,
		noNextSteps: nextStepsSelector(state).length == 0,
		noUserInput: noUserInputSelector(state)
	}))
)(
	class SimpleSimulation extends React.Component {
		state = {
			displayAnswers: false
		}
		render() {
			let { children, noNextSteps, previousAnswers } = this.props
			return (
				<>
					{this.state.displayAnswers && (
						<Answers onClose={() => this.setState({ displayAnswers: false })} />
					)}

					<Animate.fromBottom> {children}</Animate.fromBottom>
					<Conversation
						textColourOnWhite={this.props.colours.textColourOnWhite}
					/>
					{noNextSteps && (
						<>
							<h2>Plus de questions ! </h2>
							<p>Vous avez atteint l'estimation la plus précise.</p>
						</>
					)}
					{!isEmpty(previousAnswers) && (
						<button
							className="ui__ button small plain"
							onClick={() => this.setState({ displayAnswers: true })}>
							Mes réponses
						</button>
					)}
				</>
			)
		}
	}
)
