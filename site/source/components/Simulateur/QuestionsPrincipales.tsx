import { Situation } from '@/domaine/Situation'
import { Question } from '@/hooks/useQuestionsEditorialisees'

import ScrollToElement from '../utils/Scroll/ScrollToElement'
import { QuestionCourante } from './QuestionCourante'

type Props<S extends Situation = Situation> = {
	questions: Question<S>[]
}

export const QuestionsPrincipales = ({ questions }: Props) => {
	return (
		<>
			<ScrollToElement>
				<QuestionCourante questions={questions} />
			</ScrollToElement>
		</>
	)
}
