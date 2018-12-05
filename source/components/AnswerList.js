/* @flow */

import { resetSimulation } from 'Actions/actions'
import Montant from 'Components/Montant'
import Overlay from 'Components/Overlay'
import RuleLink from 'Components/RuleLink'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
// $FlowFixMe
import { reset } from 'redux-form'
import { createSelector } from 'reselect'
import { règleAvecValeurSelector } from 'Selectors/regleSelectors'
import { softCatch } from '../utils'
import './AnswerList.css'

const formatAnswer = (answer, language) => {
	if (answer.type === 'boolean')
		return (
			<span style={{ textTransform: 'capitalize' }}>
				<Trans>{answer.valeur ? 'oui' : 'non'}</Trans>{' '}
			</span>
		)
	if (answer.type === 'euros') return <Montant>{answer.valeur}</Montant>
	if (answer.type === 'number') return
	{
		Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(
			answer.valeur
		)
	}
	if (answer.type === 'string') return <Trans>{answer.valeur}</Trans>
	return answer.valeur
}

const AnswerList = ({
	answers,
	onClose,
	language,
	colours,
	changeAnswer,
	resetSimulation
}) => (
	<Overlay onClose={onClose} className="answer-list">
		<h2>
			<Trans>Mes réponses</Trans>
		</h2>
		<p style={{ textAlign: 'center' }}>
			{emoji('🗑')}{' '}
			<button className="ui__ link-button" onClick={resetSimulation}>
				<Trans>Effacer</Trans>
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
									changeAnswer(answer.id)
									onClose()
								}}>
								<span
									className="answerContent"
									style={{ borderBottomColor: colours.textColourOnWhite }}>
									{formatAnswer(answer, language)}
								</span>
							</button>{' '}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</Overlay>
)

const answerWithValueSelector = createSelector(
	state => state.conversationSteps.foldedSteps,
	règleAvecValeurSelector,
	(answers, getRègle) => answers.map(softCatch(getRègle)).filter(Boolean)
)

export default compose(
	withLanguage,
	withColours,
	connect(
		state => ({ answers: answerWithValueSelector(state) }),
		(dispatch: Function) => ({
			resetSimulation: () => {
				dispatch(resetSimulation())
				dispatch(reset('conversation'))
			},
			changeAnswer: question =>
				dispatch({
					type: 'STEP_ACTION',
					name: 'unfold',
					step: question
				})
		})
	)
)(AnswerList)
