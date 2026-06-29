import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button, H3, ReturnLeftIcon } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import { useAutoScrollToQuestions } from './AutoScrollToQuestions'
import { QuestionPublicodes } from './QuestionPublicodes'

type Props<S extends Situation = Situation> = {
	questions: Array<Question<S>>
	retour?: () => void
}

export const QuestionCourante = ({ questions, retour }: Props) => {
	const { t } = useTranslation()
	const { autoScrollToQuestions } = useAutoScrollToQuestions()

	return (
		<Container>
			<ScrollToElement when={autoScrollToQuestions}>
				{questions.map((Question) => (
					<React.Fragment key={Question.id}>
						{Question._tag === 'QuestionFournie' && (
							<fieldset>
								<QuestionTitle as="legend">{Question.libellé(t)}</QuestionTitle>
								<Question />
							</fieldset>
						)}

						{Question._tag === 'QuestionPublicodes' && (
							<QuestionPublicodes question={Question} />
						)}
					</React.Fragment>
				))}
			</ScrollToElement>

			{retour && (
				<StyledDiv>
					<Button light size="XS" onPress={retour}>
						<ReturnLeftIcon />
						{t(
							'components.simulateur.zone-de-saisie.situation.retour-liste',
							'Revenir à la liste'
						)}
					</Button>
				</StyledDiv>
			)}
		</Container>
	)
}

const QuestionTitle = styled(H3)`
	margin-top: 0;
`

const StyledDiv = styled.div`
	margin-top: ${({ theme }) => theme.spacings.xl};
	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		padding-bottom: ${({ theme }) => theme.spacings.xl};
		border-bottom: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	}
`

const Container = styled.div`
	height: calc(100% - 5rem);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`
