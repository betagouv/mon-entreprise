import { goToQuestion, resetSimulation } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import Value from 'Components/Value'
import { getRuleFromAnalysis } from 'Engine/ruleUtils'
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
			{next.length > 0 && (
				<>
					<h2>
						{emoji('🔮 ')}
						<Trans>Prochaines questions</Trans>
					</h2>
					<StepsTable {...{ rules: next, onClose }} />
				</>
			)}
		</Overlay>
	)
}

function StepsTable({ rules, onClose }) {
	const dispatch = useDispatch()
	return (
		<table>
			<tbody>
				{rules
					.filter(rule => rule.nodeValue !== undefined)
					.map(rule => (
						<tr
							key={rule.dottedName}
							css={`
								background: var(--lightestColor);
							`}
						>
							<td>
								<button
									className="ui__ link-button"
									onClick={() => {
										dispatch(goToQuestion(rule.dottedName))
										onClose()
									}}
								>
									{rule.title}
								</button>
							</td>
							<td>
								<span
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
											border-bottom-color: var(--textColorOnWhite);
											padding: 0.05em 0em;
											display: inline-block;
										}
									`}
								>
									<span className="answerContent">
										<Value {...rule} />
									</span>
								</span>{' '}
							</td>
						</tr>
					))}
			</tbody>
		</table>
	)
}

const stepsToRules = createSelector(
	(state: RootState) => state.simulation?.foldedSteps || [],
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
