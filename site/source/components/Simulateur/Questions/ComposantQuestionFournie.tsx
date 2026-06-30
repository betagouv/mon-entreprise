import { Predicate } from 'effect/Predicate'
import { TFunction } from 'i18next'

import { Situation } from '@/domaine/Situation'

export type ComposantQuestionFournie<S extends Situation> =
	React.FunctionComponent & {
		_tag: 'QuestionFournie'
		id: string
		libellé: (t: TFunction) => string
		applicable: Predicate<S>
	}

export type GroupeDeQuestionsFournies<S extends Situation> = {
	titre: (t: TFunction) => string
	liste: ComposantQuestionFournie<S>[]
}
