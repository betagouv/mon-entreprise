import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import { ScrollToElement } from 'Components/utils/Scroll'
import withColours from 'Components/utils/withColours'
import { compose, isEmpty } from 'ramda'
import { React, T } from 'Components'
import { connect } from 'react-redux'
import {
	nextStepsSelector,
	noUserInputSelector,
	blockingInputControlsSelector,
	validInputEnteredSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'
import PageFeedback from 'Components/Feedback/PageFeedback'

export default compose(
	withColours,
	connect(state => ({
		conversationStarted: state.conversationStarted,
		previousAnswers: state.conversationSteps.foldedSteps,
		noNextSteps:
			state.conversationStarted && nextStepsSelector(state).length == 0,
		noUserInput: noUserInputSelector(state),
		blockingInputControls: blockingInputControlsSelector(state),
		validInputEntered: validInputEnteredSelector(state)
	}))
)(
	class Simulation extends React.Component {
		state = {
			displayAnswers: false
		}
		render() {
			let {
				noNextSteps,
				previousAnswers,
				noUserInput,
				conversationStarted,
				hideUntilUserInput,
				blockingInputControls,
				validInputEntered
			} = this.props
			let arePreviousAnswers = previousAnswers.length > 0,
				displayConversation = conversationStarted && !blockingInputControls
			return (
				<>
					{this.state.displayAnswers && (
						<Answers onClose={() => this.setState({ displayAnswers: false })} />
					)}
					{!isEmpty(previousAnswers) && (
						<button
							className="ui__ button small plain"
							style={{
								visibility: arePreviousAnswers ? 'visible' : 'hidden'
							}}
							onClick={() => this.setState({ displayAnswers: true })}>
							{' '}
							Mes réponses
						</button>
					)}

					{displayConversation && (
						<>
							<Conversation
								textColourOnWhite={this.props.colours.textColourOnWhite}
							/>
							{noNextSteps && (
								<>
									<h1>
										<T k="simulation-end.title">Plus de questions !</T>
									</h1>
									<T k="simulation-end.text">
										Vous avez atteint l'estimation la plus précise. Vous
									</T>
									{this.props.customEndMessage}
								</>
							)}
						</>
					)}
					<Animate.fromBottom>{this.props.targets}</Animate.fromBottom>
					{validInputEntered && (
						<PageFeedback
							customMessage={
								<T k="feedback.simulator">Ce simulateur vous a plu ?</T>
							}
							customEventName="rate simulator"
						/>
					)}
					{!noUserInput && this.props.explanation}
				</>
			)
		}
	}
)
