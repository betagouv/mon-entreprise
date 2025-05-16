import { AnyAction } from 'redux'

export interface Situation {
	_tag: 'Situation'
	_type?: string
}

export type SituationAction = AnyAction & {
	_situationType: string
}
