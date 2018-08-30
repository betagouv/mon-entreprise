import { startConversation } from 'Actions/actions'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
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
import ResultView from './ResultView'
import './Simu.css'
import Sondage from './Sondage'
import TargetSelection from './TargetSelection'

@withColours
@translate() // Triggers rerender when the language changes
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
@withLanguage
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
								<Trans>Modifier mes réponses</Trans>
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
									justifyContent: 'space-evenly',
									marginBottom: '0.6rem'
								}}>
								<QuickLink />
							</animated.div>
						)}
					</Spring>
					{simulationCompleted && (
						<>
							<h1>
								<Trans i18nKey="simulation-end.title">
									Plus de questions !
								</Trans>
							</h1>
							<p>
								<Trans i18nKey="simulation-end.text">
									Vous avez atteint l'estimation la plus précise. Vous pouvez
									maintenant concrétiser votre projet d'embauche.
								</Trans>
							</p>
							{this.props.displayHiringProcedures && (
								<div style={{ textAlign: 'center' }}>
									<Link className="ui__ button" to="/hiring-process">
										<Trans i18nKey="simulation-end.cta">
											Connaître les démarches
										</Trans>
									</Link>
								</div>
							)}
							<br />
						</>
					)}
					<div id="focusZone">
						{displayConversation && (
							<Conversation textColourOnWhite={colours.textColourOnWhite} />
						)}
						<TargetSelection colours={colours} />
					</div>
					{conversationStarted && (
						<Animate.fromBottom>
							<ResultView />
							<div style={{ textAlign: 'center' }}>
								<Sondage />
							</div>
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
							<Trans>Simulation personnalisée</Trans>
						</h2>
						<p>
							<Trans i18nKey="custom-simulation">
								Il s'agit pour l'instant d'une
								<strong> première estimation</strong> sur la base d'un contrat
								générique. La législation française prévoit une multitude de cas
								particuliers et de règles spécifiques qui modifient
								considérablement les montant de l'embauche.
							</Trans>
						</p>
						<p style={{ textAlign: 'center' }}>
							<button
								className="ui__ button"
								onClick={() => startConversation()}>
								<Trans>Faire une simulation personnalisée</Trans>
							</button>
						</p>
						<h2>
							<Trans>Fiche de paie</Trans>
						</h2>
						<PaySlip />
						<Sondage />
					</Animate.fromBottom>
				)}
			</>
		)
	}
}
