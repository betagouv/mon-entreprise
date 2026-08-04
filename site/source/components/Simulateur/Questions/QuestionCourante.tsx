import React from 'react'

import ScrollToElement from '@/components/utils/Scroll/ScrollToElement'
import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import { useAutoScrollToQuestions } from '../AutoScrollToQuestions'
import { QuestionFournie } from './QuestionFournie'
import { QuestionPublicodes } from './QuestionPublicodes'

type Props<S extends Situation> = {
	questions: Array<Question<S>>
}

export const QuestionCourante = <S extends Situation = Situation>({
	questions,
}: Props<S>) => {
	const { autoScrollToQuestions } = useAutoScrollToQuestions()

	return (
		<ScrollToElement when={autoScrollToQuestions}>
			{questions.map((Question) => (
				<React.Fragment key={Question.id}>
					{Question._tag === 'QuestionFournie' && (
						<QuestionFournie Question={Question} />
					)}

					{Question._tag === 'QuestionPublicodes' && (
						<QuestionPublicodes question={Question} />
					)}
				</React.Fragment>
			))}
		</ScrollToElement>
	)
}
