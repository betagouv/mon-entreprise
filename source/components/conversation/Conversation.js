import { resetSimulation } from 'Actions/actions'
import { T } from 'Components'
import Aide from 'Components/Aide'
import Answers from 'Components/AnswerList'
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
			noNextSteps: nextStepsSelector(state).length == 0,
			progress: simulationProgressSelector(state)
		}),
		{ resetSimulation }
	)
)(function Conversation({
	noNextSteps,
	previousAnswers,
	currentQuestion,
	customEndMessages,
	flatRules,
	progress,
	resetSimulation
}) {
	const arePreviousAnswers = previousAnswers.length > 0
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	return (
		<>
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
						Précision du résultat :
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
			</Animate.fromTop>

			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}

			<div className="ui__ full-width choice-group">
				<div className="ui__ container">
					{!noNextSteps ? (
						<Scroll.toElement onlyIfNotVisible>
							<Aide />
							<div id="currentQuestion">
								{currentQuestion && (
									<React.Fragment key={currentQuestion}>
										<Animate.fromTop>
											{getInputComponent(flatRules)(currentQuestion)}
										</Animate.fromTop>
									</React.Fragment>
								)}
							</div>
							{/* {!arePreviousAnswers && (
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<span style={{ marginRight: '1rem' }}>
										Aller aux questions :{' '}
									</span>
									<QuickLinks show />
								</div>
							)} */}
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
		</>
	)
})
