import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { H3 } from '@/design-system'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import { useAutoScrollToQuestions } from './AutoScrollToQuestions'
import { QuestionPublicodes } from './QuestionPublicodes'

type Props<S extends Situation = Situation> = {
	questions: Array<Question<S>>
}

export const QuestionCourante = ({ questions }: Props) => {
	const { t } = useTranslation()
	const { autoScrollToQuestions } = useAutoScrollToQuestions()

	return (
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
	)
}

const QuestionTitle = styled(H3)`
	margin-top: 0;
`
