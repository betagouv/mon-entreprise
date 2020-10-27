import { goToQuestion } from 'Actions/actions'
import { contains, filter, pipe, reject, toPairs } from 'ramda'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'

import { useNextQuestions } from './utils/useNextQuestion'
import {
	answeredQuestionsSelector,
	currentQuestionSelector
} from 'Selectors/simulationSelectors'

export default function QuickLinks() {
	const currentQuestion = useSelector(currentQuestionSelector)
	const nextSteps = useNextQuestions()
	const quickLinks = useSelector(
		(state: RootState) => state.simulation?.config.questions?.["à l'affiche"]
	)
	const quickLinksToHide = useSelector(answeredQuestionsSelector)
	const dispatch = useDispatch()

	if (!quickLinks) {
		return null
	}
	const links = pipe(
		reject((dottedName: DottedName) => contains(dottedName, quickLinksToHide)),
		filter((dottedName: DottedName) => contains(dottedName, nextSteps)),
		toPairs
	)(quickLinks)

	if (links.length < 1) {
		return null
	}

	return (
		<span>
			<small>Questions :</small>
			{links.map(([label, dottedName]) => (
				<button
					key={dottedName}
					className={`ui__ link-button ${
						dottedName === currentQuestion ? 'active' : ''
					}`}
					css="margin: 0 0.4rem !important"
					onClick={() => dispatch(goToQuestion(dottedName))}
				>
					<Trans i18nKey={'quicklinks.' + label}>{label}</Trans>
				</button>
			))}{' '}
			{/* <button className="ui__ link-button">Voir la liste</button> */}
		</span>
	)
}
