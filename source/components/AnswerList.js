import Montant from 'Components/Montant'
import Overlay from 'Components/Overlay'
import RuleLink from 'Components/RuleLink'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { règleAvecValeurSelector } from 'Selectors/regleSelectors'
import './AnswerList.css'

const formatAnswer = (answer, language) => {
	if (answer.type === 'boolean')
		return (
			<span style={{ textTransform: 'capitalize' }}>
				<Trans>{answer.valeur ? 'oui' : 'non'}</Trans>{' '}
				{answer.valeur ? '✅' : <span style={{ color: 'red' }}>✘</span>}
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

const AnswerList = ({ answers, onClose, language }) => (
	<Overlay onClose={onClose} className="answer-list">
		<h2>My answers</h2>
		<table>
			<tbody>
				{answers.map(answer => (
					<tr key={answer.nom}>
						<td>
							<RuleLink {...answer} />
						</td>
						<td>
							<button className="answer">
								{formatAnswer(answer, language)}
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
	(answers, getRegle) => answers.map(getRegle)
)

export default compose(
	withLanguage,
	connect(state => ({ answers: answerWithValueSelector(state) }))
)(AnswerList)
