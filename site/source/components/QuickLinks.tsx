import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Link, SmallBody, Spacing } from '@/design-system'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { vaÀLaQuestion } from '@/store/actions/actions'
import { RootState } from '@/store/reducers/rootReducer'
import { currentQuestionSelector } from '@/store/selectors/currentQuestion.selector'
import { questionsRéponduesNomSelector } from '@/store/selectors/questionsRéponduesNom.selector'

export default function QuickLinks() {
	const currentQuestion = useSelector(currentQuestionSelector)
	const nextSteps = useNextQuestions()
	const quickLinks = useSelector(
		(state: RootState) => state.simulation?.config.questions?.["à l'affiche"]
	)
	const quickLinksToHide = useSelector(questionsRéponduesNomSelector)
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
		<StyledLinks as="div">
			<p>Aller à la question : </p>

			<StyledList>
				{links.map(({ label, dottedName }) => (
					<li key={dottedName}>
						<StyledLink
							$underline={dottedName === currentQuestion}
							onPress={() => dispatch(vaÀLaQuestion(dottedName))}
							aria-label={t(
								'{{question}}, aller à la question : {{question}}',
								{
									question: label,
								}
							)}
						>
							{label}
						</StyledLink>
					</li>
				))}
			</StyledList>
		</StyledLinks>
	)
}

const StyledLinks = styled(SmallBody)`
	display: inline-flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledList = styled.ul`
	display: flex;
	gap: 12px;
	margin: 1em 0;
	padding: 0;
	list-style: none;
`

const StyledLink = styled(Link)<{ $underline: boolean }>`
	text-decoration: ${({ $underline }) => ($underline ? 'underline' : '')};
`
