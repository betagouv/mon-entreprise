import { goToQuestion, resetSimulation } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import RuleLink from 'Components/RuleLink'
import Value from 'Components/Value'
import { getRuleFromAnalysis } from 'Engine/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { createSelector } from 'reselect'
import {
	analysisWithDefaultsSelector,
	nextStepsSelector
} from 'Selectors/analyseSelectors'
import { softCatch } from '../../utils'
import './AnswerList.css'

export default function AnswerList({ onClose }) {
	const dispatch = useDispatch()
	const { folded, next } = useSelector(stepsToRules)
	return (
		<Overlay onClose={onClose} className="answer-list">
			<h2>
				{emoji('📋 ')}
				<Trans>Mes réponses</Trans>
				<small css="margin-left: 2em; img {font-size: .8em}">
					{emoji('🗑')}{' '}
					<button
						className="ui__ simple small button"
						onClick={() => {
							dispatch(resetSimulation())
							onClose()
						}}
					>
						<Trans>Tout effacer</Trans>
					</button>
				</small>
			</h2>
			<StepsTable {...{ rules: folded, onClose }} />
			<h2>
				{emoji('🔮 ')}
				<Trans>Prochaines questions</Trans>
			</h2>
			<StepsTable {...{ rules: next, onClose }} />
		</Overlay>
	)
}

function StepsTable({ rules, onClose }) {
	const dispatch = useDispatch()
	return (
		<table>
			<tbody>
				{rules.map(rule => (
					<tr
						key={rule.dottedName}
						css={`
							background: var(--lightestColour);
						`}
					>
						<td>
							<RuleLink {...rule} />
						</td>
						<td>
							<button
								className="answer"
								css={`
									display: inline-block;
									padding: 0.6rem;
									color: inherit;
									font-size: inherit;
									width: 100%;
									text-align: start;
									font-weight: 500;
									> span {
										border-bottom: 1px dashed blue;
										border-bottom-color: var(--textColourOnWhite);
										padding: 0.05em 0em;
										display: inline-block;
									}
								`}
								onClick={() => {
									dispatch(goToQuestion(rule.dottedName))
									onClose()
								}}
							>
								<span className="answerContent">
									<Value {...rule} />
								</span>
							</button>{' '}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

const stepsToRules = createSelector(
	(state: RootState) => state.conversationSteps.foldedSteps,
	nextStepsSelector,
	analysisWithDefaultsSelector,
	(folded, nextSteps, analysis) => ({
		folded: folded
			.map(softCatch(getRuleFromAnalysis(analysis)))
			.filter(Boolean),
		next: nextSteps
			.map(softCatch(getRuleFromAnalysis(analysis)))
			.filter(Boolean)
	})
)
