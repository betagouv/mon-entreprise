import { Situation } from './situation'

export interface Question<T, S extends Situation> {
	libellé: string
	applicable: (situation: S) => boolean
	répond: (situation: S, data: T) => S
	estRépondue: (situation: S) => boolean
}
