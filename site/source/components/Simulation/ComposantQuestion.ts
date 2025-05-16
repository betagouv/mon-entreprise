import { Predicate } from 'effect/Predicate'

import { Situation } from '@/domaine/Situation'

export type ComposantQuestion<
	S extends Situation,
	P = object,
> = React.FunctionComponent<P> & {
	_tag: 'QuestionFournie'
	id: string
	libellé: string
	applicable: Predicate<S>
	répondue: Predicate<S>
}
