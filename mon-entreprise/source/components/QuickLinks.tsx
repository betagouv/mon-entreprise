import { goToQuestion } from 'Actions/actions'
import { Link } from 'DesignSystem/typography/link'
import { DottedName } from 'modele-social'
import { contains, filter, pipe, reject, toPairs } from 'ramda'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	answeredQuestionsSelector,
	currentQuestionSelector,
} from 'Selectors/simulationSelectors'
import { css } from 'styled-components'
import { useNextQuestions } from './utils/useNextQuestion'

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
		<small>
			Questions :
			{links.map(([label, dottedName]) => (
				<Link
					key={dottedName}
					css={
						dottedName === currentQuestion
							? css`
									text-decoration: underline;
							  `
							: ''
					}
					onPress={() => dispatch(goToQuestion(dottedName))}
				>
					<Trans i18nKey={'quicklinks.' + label}>{label}</Trans>
				</Link>
			))}{' '}
			{/* <button className="ui__ link-button">Voir la liste</button> */}
		</small>
	)
}
