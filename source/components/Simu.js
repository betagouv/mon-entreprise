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
		nextSteps: state.conversationStarted && nextStepsSelector(state)
	}),
	{
		startConversation: () => ({ type: 'START_CONVERSATION' })
	}
)
export default class Simu extends Component {
	render() {
		let {
			colours,
			conversationStarted,
			noUserInput,
			nextSteps,
			startConversation,
			blockingInputControls
		} = this.props
		const firstValidInputEntered =
			!conversationStarted && !blockingInputControls && !noUserInput
		const displayConversation = conversationStarted && !blockingInputControls
		const simulationCompleted =
			!blockingInputControls && conversationStarted && !nextSteps.length

		return (
			<>
				<div id="simu">
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
					{conversationStarted &&
						!nextSteps.length && (
							<>
								<h1>No more questions left!</h1>
								<p>
									<Trans>
										You have reached the most accurate estimate. You can now
										turn your hiring project into reality.
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
								<Conversation textColourOnWhite={colours.textColourOnWhite} />
							</>
						)}
						<TargetSelection colours={colours} />
					</div>
					{conversationStarted &&
						!simulationCompleted && (
							<div style={{ textAlign: 'center' }}>
								<Link className="ui__ button" to="/hiring-process">
									Go to the hiring process
								</Link>
							</div>
						)}
					{simulationCompleted && (
						<Animate.fromBottom>
							<h2>Detailed payslip</h2>
							<PaySlip />
						</Animate.fromBottom>
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
