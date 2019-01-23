import { resetSimulation } from 'Actions/actions'
import { React, T } from 'Components'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import { connect } from 'react-redux'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector,
	validInputEnteredSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'

export default compose(
	withColours,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			previousAnswers: state.conversationSteps.foldedSteps,
			noNextSteps:
				state.conversationStarted && nextStepsSelector(state).length == 0,
			noUserInput: noUserInputSelector(state),
			blockingInputControls: blockingInputControlsSelector(state),
			validInputEntered: validInputEnteredSelector(state)
		}),
		{ resetSimulation }
	)
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
				resetSimulation,
				blockingInputControls,
				showTargetsAnyway,
				targetsTriggerConversation
			} = this.props
			let arePreviousAnswers = previousAnswers.length > 0,
				displayConversation =
					(!targetsTriggerConversation || conversationStarted) &&
					!blockingInputControls,
				showTargets =
					targetsTriggerConversation || !noUserInput || showTargetsAnyway
			return (
				<>
					{this.state.displayAnswers && (
						<Answers onClose={() => this.setState({ displayAnswers: false })} />
					)}
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						{arePreviousAnswers && (
							<button
								className="ui__ small button "
								onClick={() => this.setState({ displayAnswers: true })}>
								Voir mes réponses
							</button>
						)}
						{displayConversation ? (
							<button
								className="ui__ small simple skip button left"
								onClick={() => resetSimulation()}>
								⟲ <T>Recommencer</T>
							</button>
						) : (
							<span />
						)}
					</div>

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
										Vous avez atteint l'estimation la plus précise.
									</T>
									{this.props.customEndMessages}
								</>
							)}
						</>
					)}
					{showTargets && (
						<Animate.fromBottom>{this.props.targets}</Animate.fromBottom>
					)}
					{!noUserInput && this.props.explanation}
				</>
			)
		}
	}
)
