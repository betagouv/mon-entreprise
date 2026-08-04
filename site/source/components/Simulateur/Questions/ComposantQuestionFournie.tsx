import { Predicate } from 'effect/Predicate'
import { TFunction } from 'i18next'

import { Situation } from '@/domaine/Situation'

export type ComposantQuestionFournie<S extends Situation> =
	React.FunctionComponent & {
		_tag: 'QuestionFournie'
		id: string
		libellé: (t: TFunction) => string
		typeRadioGroup: boolean
		applicable: Predicate<S | undefined>
		Valeur: React.FunctionComponent
	}

export type GroupeDeQuestionsFournies<S extends Situation> = {
	titre: (t: TFunction) => string
	Réponse?: React.FunctionComponent
	liste: ComposantQuestionFournie<S>[]
}
