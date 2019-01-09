import { startConversation } from 'Actions/actions'
import { Component, React, T } from 'Components'
import AnswerList from 'Components/AnswerList'
import { ScrollToTop } from 'Components/utils/Scroll'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { formValueSelector } from 'redux-form'
import {
	blockingInputControlsSelector,
	nextStepsSelector,
	noUserInputSelector,
	validInputEnteredSelector
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import sitePaths from '../sites/mycompanyinfrance.fr/sitePaths'
import { normalizeBasePath } from '../utils'
import Conversation from './conversation/Conversation'
import Distribution from './Distribution'
import PageFeedback from './Feedback/PageFeedback'
import PaySlip from './PaySlip'
import QuickLink from './QuickLink'
import ResultView from './ResultView'
import './SalarySimulation.css'
import TargetSelection from './TargetSelection'

export default compose(
	withRouter,
	withColours,
	withNamespaces(), // Triggers rerender when the language changes
	connect(
		state => ({
			blockingInputControls: blockingInputControlsSelector(state),
			conversationStarted: state.conversationStarted,
			validInputEntered: validInputEnteredSelector(state),
			arePreviousAnswers: state.conversationSteps.foldedSteps.length !== 0,
			nextSteps: state.conversationStarted && nextStepsSelector(state),
			noUserInput: noUserInputSelector(state),
			period: formValueSelector('conversation')(state, 'période')
		}),
		{
			startConversation
		}
	),
	withLanguage
)(
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
				displayHiringProcedures,
				match,
				validInputEntered,
				location,
				period,
				noUserInput
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
						{noUserInput && (
							<p
								id="updateMessage"
								style={{ fontStyle: 'italic', textAlign: 'center' }}>
								{emoji('🌟')}{' '}
								<T k="maj2019">
									Le simulateur est à jour aux taux 2019 –{' '}
									<a href="https://github.com/betagouv/syso/issues/441">
										détails
									</a>
								</T>
							</p>
						)}
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
										{displayHiringProcedures && (
											<div style={{ textAlign: 'center' }}>
												<Link
													className="ui__ button"
													to={sitePaths().démarcheEmbauche}>
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
										<Conversation
											textColourOnWhite={colours.textColourOnWhite}
										/>
									</>
								)}
							</>
						)}
						<TargetSelection colours={colours} />
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
											modifient considérablement les montants de l'embauche.
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
								<Trans>
									{period === 'mois'
										? 'Fiche de paie mensuelle'
										: 'Détail annuel des cotisations'}
								</Trans>
							</h2>
							<PaySlip />
						</Animate.fromBottom>
					)}
				</>
			)
		}
	}
)
