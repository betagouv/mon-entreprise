import { goToQuestion, resetSimulation, skipQuestion } from 'Actions/actions'
import { T } from 'Components'
import Aide from 'Components/Aide'
import Answers from 'Components/AnswerList'
import QuickLinks from 'Components/QuickLinks'
import Scroll from 'Components/utils/Scroll'
import withColours from 'Components/utils/withColours'
import { getInputComponent } from 'Engine/generateQuestions'
import { compose } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import {
	currentQuestionSelector,
	flatRulesSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import { simulationProgressSelector } from 'Selectors/progressSelectors'
import * as Animate from 'Ui/animate'
import Progress from 'Ui/Progress'
import './conversation.css'

export default compose(
	withColours,
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	withTranslation(),

	connect(
		state => ({
			flatRules: flatRulesSelector(state),
			currentQuestion: currentQuestionSelector(state),
			previousAnswers: state.conversationSteps.foldedSteps,
			nextSteps: nextStepsSelector(state),
			progress: simulationProgressSelector(state)
		}),
		{ resetSimulation, skipQuestion, goToQuestion }
	)
)(function Conversation({
	nextSteps,
	previousAnswers,
	currentQuestion,
	customEndMessages,
	flatRules,
	progress,
	resetSimulation,
	skipQuestion,
	goToQuestion
}) {
	const arePreviousAnswers = previousAnswers.length > 0
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	return (
		<Animate.fromTop>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'baseline'
				}}>
				<p
					style={{
						flex: 1,
						maxWidth: '50%'
					}}>
					<small>Précision du résultat :</small>
					<Progress progress={progress} />
				</p>
				<div style={{ flex: 1 }} />

				{arePreviousAnswers ? (
					<button
						style={{ marginRight: '1em', alignSelf: 'baseline' }}
						className="ui__ small  button "
						onClick={() => setShowAnswerModal(true)}>
						<T>Voir mes réponses</T>
					</button>
				) : (
					<span />
				)}
				<button
					className="ui__ small simple skip button left"
					style={{ alignSelf: 'baseline' }}
					onClick={() => resetSimulation()}>
					⟲ <T>Recommencer</T>
				</button>
			</div>

			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}

			<div className="ui__ full-width choice-group">
				<div className="ui__ container">
					{nextSteps.length ? (
						<Scroll.toElement onlyIfNotVisible>
							<Aide />
							<div id="currentQuestion">
								{currentQuestion && (
									<React.Fragment key={currentQuestion}>
										<Animate.fadeIn>
											{getInputComponent(flatRules)(currentQuestion)}
										</Animate.fadeIn>
										<div className="ui__ answer-group">
											{previousAnswers.length > 0 && (
												<button
													onClick={() =>
														goToQuestion(previousAnswers.slice(-1)[0])
													}
													className="ui__ simple small skip button left">
													← Précédent
												</button>
											)}
											{nextSteps.length > 0 && (
												<button
													onClick={() => skipQuestion(nextSteps[0])}
													className="ui__ simple small skip button right">
													Passer →
												</button>
											)}
										</div>
									</React.Fragment>
								)}
							</div>
							<QuickLinks />
						</Scroll.toElement>
					) : (
						<>
							<h3>
								{emoji('🌟')}{' '}
								<T k="simulation-end.title">Simulation complétée à 100%</T>{' '}
							</h3>
							<p>
								<T k="simulation-end.text">
									Nous n'avons plus de questions à poser, vous avez atteint
									l'estimation la plus précise.
								</T>
								{customEndMessages}
							</p>
						</>
					)}
				</div>
			</div>
		</Animate.fromTop>
	)
})
