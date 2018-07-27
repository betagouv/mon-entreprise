import { startConversation } from 'Actions/actions'
import ScrollToTop from 'Components/utils/ScrollToTop'
import withColours from 'Components/utils/withColours'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { animated, Spring } from 'react-spring'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import AnswerList from './AnswerList'
import Conversation from './conversation/Conversation'
import Distribution from './Distribution'
import PaySlip from './PaySlip'
import QuickLink from './QuickLink'
import './Simu.css'
import TargetSelection from './TargetSelection'

@withColours
@connect(
	state => ({
		noUserInput: noUserInputSelector(state),
		blockingInputControls: blockingInputControlsSelector(state),
		conversationStarted: state.conversationStarted,
		arePreviousAnswers: state.conversationSteps.foldedSteps.length !== 0,
		nextSteps: state.conversationStarted && nextStepsSelector(state)
	}),
	{
		startConversation
	}
)
export default class Simu extends Component {
	state = {
		displayPreviousAnswers: false
	}
	render() {
		let {
			colours,
			conversationStarted,
			noUserInput,
			arePreviousAnswers,
			nextSteps,
			startConversation,
			blockingInputControls
		} = this.props
		const firstValidInputEntered =
			!conversationStarted && !blockingInputControls && !noUserInput
		const displayConversation = conversationStarted && !blockingInputControls
		const simulationCompleted =
			!blockingInputControls && conversationStarted && !nextSteps.length
		const displayPreviousAnswers =
			arePreviousAnswers && this.state.displayPreviousAnswers

		return (
			<>
				<div id="simu">
					{arePreviousAnswers && (
						<div className="change-answer-link">
							<button
								className="ui__ link-button"
								onClick={() => this.setState({ displayPreviousAnswers: true })}>
								Change my answers
							</button>
						</div>
					)}
					<Spring
						to={{
							height: firstValidInputEntered ? 'auto' : 0,
							opacity: firstValidInputEntered ? 1 : 0
						}}
						native>
						{styles => (
							<animated.div
								className="ui__ button-container"
								style={{
									...styles,
									display: 'flex',
									overflow: 'hidden',
									flexWrap: 'wrap',
									fontSize: '110%',
									justifyContent: 'space-evenly'
								}}>
								<QuickLink />
							</animated.div>
						)}
					</Spring>
					{simulationCompleted && (
						<>
							<h1>No more questions left!</h1>
							<p>
								<Trans>
									You have reached the most accurate estimate. You can now turn
									your hiring project into reality.
								</Trans>
							</p>
							<div style={{ textAlign: 'center' }}>
								<Link className="ui__ button" to="/hiring-process">
									See the procedures
								</Link>
							</div>
						</>
					)}
					<div id="focusZone">
						{displayConversation && (
							<>
								<ScrollToTop />
								<Conversation textColourOnWhite={colours.textColourOnWhite} />
							</>
						)}
						<TargetSelection colours={colours} />
					</div>
					{conversationStarted && (
						<Animate.fromBottom>
							<h2>Payslip</h2>
							<PaySlip />
						</Animate.fromBottom>
					)}
					{displayPreviousAnswers && (
						<AnswerList
							onClose={() => this.setState({ displayPreviousAnswers: false })}
						/>
					)}
				</div>

				{firstValidInputEntered && (
					<Animate.fromBottom>
						<h2>What&apos;s included in my contributions?</h2>
						<Distribution />
						<h2>Estimate my real costs</h2>
						<p>
							This is a <strong>rough estimate</strong> based on a pre-made
							generic contract. French legislation provides for a multitude of
							special cases, and specific rules that can considerably change
							hiring costs.
						</p>
						<p style={{ textAlign: 'center' }}>
							<button className="ui__ button" onClick={startConversation}>
								Estimate my real costs
							</button>
						</p>
					</Animate.fromBottom>
				)}
			</>
		)
	}
}
