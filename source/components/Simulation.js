/* @flow */

import { resetSimulation } from 'Actions/actions'
import { React, T } from 'Components'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback/PageFeedback'
import PeriodSwitch from 'Components/PeriodSwitch'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import {
	nextStepsSelector,
	noUserInputSelector
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
			noUserInput: noUserInputSelector(state)
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
				noFeedback,
				showTargetsAnyway,
				targetsTriggerConversation
			} = this.props
			let arePreviousAnswers = previousAnswers.length > 0,
				displayConversation =
					!targetsTriggerConversation || conversationStarted,
				showTargets =
					targetsTriggerConversation || !noUserInput || showTargetsAnyway
			return (
				<>
					{this.state.displayAnswers && (
						<Answers onClose={() => this.setState({ displayAnswers: false })} />
					)}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'baseline'
						}}>
						{arePreviousAnswers ? (
							<button
								style={{ marginRight: '1em' }}
								className="ui__ small  button "
								onClick={() => this.setState({ displayAnswers: true })}>
								<T>Voir mes réponses</T>
							</button>
						) : (
							<span />
						)}
						{displayConversation && !noUserInput && (
							<button
								className="ui__ small simple skip button left"
								onClick={() => resetSimulation()}>
								⟲ <T>Recommencer</T>
							</button>
						)}
					</div>

					{displayConversation && (
						<>
							<Conversation
								textColourOnWhite={this.props.colours.textColourOnWhite}
							/>
							{noNextSteps && (
								<>
									<h2>
										{emoji('🌟')}{' '}
										<T k="simulation-end.title">Situation complétée à 100%</T>{' '}
									</h2>
									<p>
										<T k="simulation-end.text">
											Nous n'avons plus de questions à poser, vous avez atteint
											l'estimation la plus précise.
										</T>
										{this.props.customEndMessages}
									</p>
								</>
							)}
						</>
					)}
					{showTargets && (
						<Animate.fromBottom>{this.props.targets}</Animate.fromBottom>
					)}

					{!noUserInput && !noFeedback && (
						<Animate.appear delay={2000}>
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
						</Animate.appear>
					)}
					<PeriodSwitch />
					{!noUserInput && this.props.explanation}
				</>
			)
		}
	}
)
