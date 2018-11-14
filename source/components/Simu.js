import { startConversation } from 'Actions/actions'
import AnswerList from 'Components/AnswerList'
import { ScrollToTop } from 'Components/utils/Scroll'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector,
	validInputEnteredSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import { normalizeBasePath } from '../utils'
import Conversation from './conversation/Conversation'
import Distribution from './Distribution'
import PageFeedback from './Feedback/PageFeedback'
import PaySlip from './PaySlip'
import PeriodSwitch from './PeriodSwitch'
import QuickLink from './QuickLink'
import ResultView from './ResultView'
import './Simu.css'
import TargetSelection from './TargetSelection'

@withRouter
@withColours
@translate() // Triggers rerender when the language changes
@connect(
	state => ({
		blockingInputControls: blockingInputControlsSelector(state),
		conversationStarted: state.conversationStarted,
		validInputEntered: validInputEnteredSelector(state),
		arePreviousAnswers: state.conversationSteps.foldedSteps.length !== 0,
		nextSteps: state.conversationStarted && nextStepsSelector(state),
		userInput: noUserInputSelector(state)
	}),
	{
		startConversation
	}
)
@withLanguage
class Simulation extends Component {
	state = {
		displayPreviousAnswers: false
	}
	render() {
		let {
			colours,
			conversationStarted,
			arePreviousAnswers,
			nextSteps,
			startConversation,
			blockingInputControls,
			match,
			validInputEntered,
			location
		} = this.props
		const displayConversation = conversationStarted && !blockingInputControls
		const simulationCompleted =
			!blockingInputControls && conversationStarted && !nextSteps.length
		const displayPreviousAnswers =
			arePreviousAnswers && this.state.displayPreviousAnswers
		const simulationHomePath = normalizeBasePath(match.path).replace(
			/\/simulation\/$/,
			''
		)
		return (
			<>
				<div id="simu">
					<QuickLink />
					{location.pathname.endsWith('/simulation') && (
						<>
							{!conversationStarted && <Redirect to={simulationHomePath} />}
							<Link to={simulationHomePath} style={{ position: 'absolute' }}>
								<i
									className="fa fa-arrow-left"
									aria-hidden="true"
									style={{ marginRight: '0.5rem' }}
								/>
								<Trans>Retour</Trans>
							</Link>

							<div
								className="change-answer-link"
								style={{
									visibility: arePreviousAnswers ? 'visible' : 'hidden'
								}}>
								<button
									className="ui__ link-button"
									onClick={() =>
										this.setState({ displayPreviousAnswers: true })
									}>
									<Trans>Modifier mes réponses</Trans>
								</button>
							</div>
							{displayPreviousAnswers && (
								<AnswerList
									onClose={() =>
										this.setState({ displayPreviousAnswers: false })
									}
								/>
							)}
							{simulationCompleted && (
								<>
									<h1>
										<Trans i18nKey="simulation-end.title">
											Plus de questions !
										</Trans>
									</h1>
									<p>
										<Trans i18nKey="simulation-end.text">
											Vous avez atteint l'estimation la plus précise. Vous
											pouvez maintenant concrétiser votre projet d'embauche.
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
							{displayConversation && (
								<>
									<ScrollToTop />
									<Conversation textColourOnWhite={colours.textColourOnWhite} />
								</>
							)}
						</>
					)}
					<TargetSelection colours={colours} />
					<PeriodSwitch />
					{location.pathname.endsWith('/simulation') && (
						<>
							{conversationStarted && (
								<Animate.fromBottom>
									<ResultView />
									<div style={{ textAlign: 'center' }} />
								</Animate.fromBottom>
							)}
						</>
					)}

					{validInputEntered && (
						<PageFeedback
							customMessage={
								<Trans i18nKey="feedback.simulator">
									Ce simulateur vous a plu ?
								</Trans>
							}
							customEventName="rate simulator"
						/>
					)}
				</div>
				{!location.pathname.endsWith('/simulation') && validInputEntered && (
					<Animate.fromBottom>
						<div style={{ textAlign: 'center' }}>
							{arePreviousAnswers && conversationStarted && (
								<button className="ui__ button" onClick={startConversation}>
									<Trans>Continuer la simulation</Trans>
								</button>
							)}
						</div>
						<h2>
							<Trans>A quoi servent mes cotisations ?</Trans>
						</h2>
						<Distribution />

						{!(arePreviousAnswers && conversationStarted) && (
							<>
								<h2>
									<Trans>Simulation personnalisée</Trans>
								</h2>
								<p>
									<Trans i18nKey="custom-simulation">
										Il s'agit pour l'instant d'une
										<strong> première estimation</strong> sur la base d'un
										contrat générique. La législation française prévoit une
										multitude de cas particuliers et de règles spécifiques qui
										modifient considérablement les montant de l'embauche.
									</Trans>
								</p>
								<p style={{ textAlign: 'center' }}>
									<button className="ui__ button" onClick={startConversation}>
										<Trans>Faire une simulation personnalisée</Trans>
									</button>
								</p>
							</>
						)}
						<h2>
							<Trans>Fiche de paie mensuelle</Trans>
						</h2>
						<PaySlip />
					</Animate.fromBottom>
				)}
			</>
		)
	}
}
export default Simulation
