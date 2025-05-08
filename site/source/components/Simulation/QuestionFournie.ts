import { Option } from 'effect/Option'
import { Predicate } from 'effect/Predicate'
import { ReactNode } from 'react'

import { Situation } from '@/domaine/économie-collaborative/location-de-meublé/situation'

export interface QuestionTypée<S extends Situation, T> {
	_tag: 'QuestionFournie'
	id: string
	libellé: string
	applicable: Predicate<Option<S>>
	répondue: Predicate<Option<S>>
	répond: (situation: Option<S>, réponse: T) => Option<S>
	renderer: (situation: Option<S>, onRéponse: (réponse: T) => void) => ReactNode
}

// QuestionFournie qui accepte n'importe quel type de réponse
export type QuestionFournie<S extends Situation> = {
	_tag: 'QuestionFournie'
	id: string
	libellé: string
	applicable: Predicate<Option<S>>
	répondue: Predicate<Option<S>>
	répond: {
		bivarianceHack(situation: Option<S>, réponse: unknown): Option<S>
	}['bivarianceHack']
	renderer: {
		bivarianceHack(
			situation: Option<S>,
			onRéponse: (x: unknown) => void
		): ReactNode
	}['bivarianceHack']
}
