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
						<h2>
							<Trans>A quoi servent mes cotisations ?</Trans>
						</h2>
						<Distribution />
						<h2>
							<Trans>Estimer mes coûts réels</Trans>
						</h2>
						<p>
							<Trans i18nk="estimate-real-costs">
								Il s'agit d'une <strong>estimation brut</strong> sur la base
								d'un contrat générique pré-établi. La législation française
								prévoit une multitude de cas particuliers et des règles
								spécifiques qui peuvent modifier considérablement les coûts
								d'embauche.
							</Trans>
						</p>
						<p style={{ textAlign: 'center' }}>
							<button className="ui__ button" onClick={startConversation}>
								<Trans>Estimer mes coûts réels</Trans>
							</button>
						</p>
					</Animate.fromBottom>
				)}
			</>
		)
	}
}
