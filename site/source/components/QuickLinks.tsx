import { goToQuestion } from 'Actions/actions'
import { Spacing } from 'DesignSystem/layout'
import { Link } from 'DesignSystem/typography/link'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import { contains, filter, pipe, reject, toPairs } from 'ramda'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	answeredQuestionsSelector,
	currentQuestionSelector,
} from 'Selectors/simulationSelectors'
import styled, { css } from 'styled-components'
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
		return <Spacing sm />
	}
	const links = pipe(
		reject((dottedName: DottedName) => contains(dottedName, quickLinksToHide)),
		filter((dottedName: DottedName) => contains(dottedName, nextSteps)),
		toPairs
	)(quickLinks)

	if (links.length < 1) {
		return <Spacing lg />
	}

	return (
		<StyledLinks>
			<span>Aller à la question : </span>
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
			))}
		</StyledLinks>
	)
}

const StyledLinks = styled(SmallBody)`
	display: inline-flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.sm};
`
