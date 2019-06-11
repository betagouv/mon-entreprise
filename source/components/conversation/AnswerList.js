import { goToQuestion, resetSimulation } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import RuleLink from 'Components/RuleLink'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { softCatch } from '../../utils'
import './AnswerList.css'
import {
	analysisWithDefaultsSelector,
	getRuleFromAnalysis
} from 'Selectors/analyseSelectors'

const AnswerList = ({
	answers,
	onClose,
	language,
	colours,
	goToQuestion,
	resetSimulation
}) => (
	<Overlay onClose={onClose} className="answer-list">
		<h2>
			<Trans>Mes réponses</Trans>
		</h2>
		<p style={{ textAlign: 'center' }}>
			{emoji('🗑')}{' '}
			<button
				className="ui__ simple small button"
				onClick={() => {
					resetSimulation()
					onClose()
				}}>
				<Trans>Tout effacer</Trans>
			</button>
		</p>
		<table>
			<tbody>
				{answers.map(answer => (
					<tr key={answer.id} style={{ background: colours.lightestColour }}>
						<td>
							<RuleLink {...answer} />
						</td>
						<td>
							<button
								className="answer"
								onClick={() => {
									goToQuestion(answer.id)
									onClose()
								}}>
								<span
									className="answerContent"
									style={{ borderBottomColor: colours.textColourOnWhite }}>
									{answer}
								</span>
							</button>{' '}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</Overlay>
)

const foldedStepsToRuleSelector = createSelector(
	state => state.conversationSteps.foldedSteps,
	analysisWithDefaultsSelector,
	(answers, analysis) =>
		answers.map(softCatch(getRuleFromAnalysis(analysis))).filter(Boolean)
)

export default compose(
	withLanguage,
	withColours,
	connect(
		state => ({ answers: foldedStepsToRuleSelector(state) }),
		{
			resetSimulation,
			goToQuestion
		}
	)
)(AnswerList)
