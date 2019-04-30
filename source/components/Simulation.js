/* @flow */

import { resetSimulation } from 'Actions/actions'
import { React, T } from 'Components'
import Answers from 'Components/AnswerList'
import Conversation from 'Components/conversation/Conversation'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import {
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'

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
				showTargetsAnyway,
				targetsTriggerConversation
			} = this.props
			let arePreviousAnswers = previousAnswers.length > 0,
				displayConversation =
					!targetsTriggerConversation || conversationStarted,
				showTargets = targetsTriggerConversation || showTargetsAnyway
			return (
				<>
					{this.state.displayAnswers && (
						<Answers onClose={() => this.setState({ displayAnswers: false })} />
					)}
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
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
					{showTargets && this.props.targets}
				</>
			)
		}
	}
)
