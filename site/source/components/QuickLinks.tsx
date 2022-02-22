import { goToQuestion } from '~/actions/actions'
import { Spacing } from '~/design-system/layout'
import { Link } from '~/design-system/typography/link'
import { SmallBody } from '~/design-system/typography/paragraphs'
import { DottedName } from 'modele-social'
import { contains, filter, pipe, reject, toPairs } from 'ramda'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/reducers/rootReducer'
import {
	answeredQuestionsSelector,
	currentQuestionSelector,
} from '~/selectors/simulationSelectors'
import styled from 'styled-components'
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
				<StyledLink
					key={dottedName}
					underline={dottedName === currentQuestion}
					onPress={() => dispatch(goToQuestion(dottedName))}
				>
					<Trans i18nKey={'quicklinks.' + label}>{label}</Trans>
				</StyledLink>
			))}
		</StyledLinks>
	)
}

const StyledLinks = styled(SmallBody)`
	display: inline-flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledLink = styled(Link)<{ underline: boolean }>`
	text-decoration: ${({ underline }) => (underline ? 'underline' : '')};
`
