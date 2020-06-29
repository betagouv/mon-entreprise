import {
	deletePreviousSimulation,
	loadPreviousSimulation,
	goToQuestion,
} from 'Actions/actions'
import React, { useState } from 'react'
import { T } from 'Components'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	noUserInputSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import emoji from 'react-easy-emoji'
import { Button } from 'Components/ui/Button'
import Answers from './conversation/AnswerList'
import { useLocation, useHistory } from 'react-router-dom'
import { last } from 'ramda'
import { extractCategories } from '../sites/publicodes/chart'

export const buildEndURL = (analysis) => {
	const total = analysis.targets[0].nodeValue,
		categories = extractCategories(analysis),
		detailsString = categories.reduce(
			(memo, next) =>
				memo +
				next.name[0] +
				(Math.round(next.nodeValue / 10) / 100).toFixed(2),
			''
		)

	return `/fin?total=${Math.round(total)}&details=${detailsString}`
}

export default function PreviousSimulationBanner() {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)
	const newSimulationStarted = !useSelector(noUserInputSelector)
	const dispatch = useDispatch()
	const foldedSteps = useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps
	)
	const arePreviousAnswers = !!foldedSteps.length
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	const analysis = useSelector(analysisWithDefaultsSelector)
	const history = useHistory()
	const location = useLocation()

	if (location.pathname.includes('/fin'))
		return (
			<div
				css={`
					display: flex;
					justify-content: center;
					button {
						margin: 0 0.2rem;
					}
					margin: 0.6rem;
				`}
			>
				{arePreviousAnswers ? (
					<Button
						className="simple small"
						onClick={() => {
							console.log('dispatch', last(foldedSteps))
							dispatch(goToQuestion(last(foldedSteps)))
							history.push('/simulateur/bilan')
						}}
					>
						{emoji('📊 ')}
						<T>Revenir à ma simulation</T>
					</Button>
				) : (
					<Button
						className="plain"
						onClick={() => {
							history.push('/simulateur/bilan')
						}}
					>
						<T>Faire le test</T>
					</Button>
				)}
			</div>
		)

	return (
		<div
			css={`
				display: flex;
				justify-content: center;
				button {
					margin: 0 0.2rem;
				}
				margin: 0.6rem;
			`}
		>
			{arePreviousAnswers && (
				<>
					<Button
						className="simple small"
						onClick={() => setShowAnswerModal(true)}
					>
						{emoji('📋 ')}
						<T>Modifier mes réponses</T>
					</Button>
					<Button
						className="simple small"
						onClick={() => history.push(buildEndURL(analysis))}
					>
						{emoji('💤 ')}
						<T>Fin</T>
					</Button>
				</>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
			{previousSimulation && !newSimulationStarted && (
				<>
					<Button
						className="simple small"
						onClick={() => dispatch(loadPreviousSimulation())}
					>
						{emoji('💾 ')}
						<Trans>Ma dernière simulation</Trans>
					</Button>
					<Button
						className="simple small"
						onClick={() => dispatch(deletePreviousSimulation())}
					>
						{emoji('🗑️ ')}
						<Trans>Effacer</Trans>
					</Button>
				</>
			)}
		</div>
	)
}
