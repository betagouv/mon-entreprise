import { Predicate } from 'effect/Predicate'
import { ReactNode } from 'react'

import { Situation } from '@/domaine/économie-collaborative/location-de-meublé/situation'

export interface Question<S extends Situation, T> {
	libellé: string
	applicable: Predicate<S>
	estRépondue: Predicate<S>
	répond: (situation: S, réponse: T) => S
	renderer: (situation: S, onRéponse: (réponse: T) => void) => ReactNode
}

// QuestionQuelconque qui accepte n'importe quel type de réponse
export type QuestionQuelconque<S extends Situation> = {
	libellé: string
	applicable: Predicate<S>
	estRépondue: Predicate<S>
	répond: {
		bivarianceHack(situation: S, réponse: unknown): S
	}['bivarianceHack']
	renderer: {
		bivarianceHack(situation: S, onRéponse: (x: unknown) => void): ReactNode
	}['bivarianceHack']
}
