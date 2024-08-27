import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { vaÀLaQuestion } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesSelector } from '@/store/selectors/questionsRépondues.selector'

export default function QuickLinks() {
	const currentQuestion = useSelector(currentQuestionSelector)
	const nextSteps = useNextQuestions()
	const quickLinks = useSelector(
		(state: RootState) => state.simulation?.config.questions?.["à l'affiche"]
	)
	const quickLinksToHide = useSelector(questionsRéponduesSelector)
	const dispatch = useDispatch()

	const { t } = useTranslation()

	if (!quickLinks) {
		return <Spacing sm />
	}
	const links = quickLinks.filter(
		({ dottedName }) =>
			nextSteps.includes(dottedName) && !quickLinksToHide.includes(dottedName)
	)

	if (links.length < 1) {
		return <Spacing lg />
	}

	return (
		<StyledLinks>
			<span>Aller à la question : </span>
			{links.map(({ label, dottedName }) => (
				<StyledLink
					key={dottedName}
					$underline={dottedName === currentQuestion}
					onPress={() => dispatch(vaÀLaQuestion(dottedName))}
					aria-label={t('{{question}}, aller à la question : {{question}}', {
						question: label,
					})}
				>
					{label}
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

const StyledLink = styled(Link)<{ $underline: boolean }>`
	text-decoration: ${({ $underline }) => ($underline ? 'underline' : '')};
`
