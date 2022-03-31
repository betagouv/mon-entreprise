import { DottedName } from '@/../../modele-social'
import { Action } from '@/actions/actions'
import { Situation } from './rootReducer'

const SAVED_NAMESPACES = ['DRI'] as Array<DottedName>

export function DRISituation(state: Situation = {}, action: Action) {
	switch (action.type) {
		case 'UPDATE_SITUATION':
			if (
				SAVED_NAMESPACES.some((namespace) =>
					action.fieldName.startsWith(namespace)
				)
			) {
				return {
					...state,
					[action.fieldName]: action.value,
				}
			}
			break
		case 'COMPANY::RESET':
			return {}
	}

	return state
}
