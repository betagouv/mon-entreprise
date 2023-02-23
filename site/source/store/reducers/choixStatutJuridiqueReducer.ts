import { combineReducers } from 'redux'

import { Action } from '@/store/actions/actions'
import { LegalStatus } from '@/store/selectors/companyStatusSelectors'
import { LegalStatusRequirements } from '@/types/companyTypes'
import { omit } from '@/utils'

function companyLegalStatus(
	state: LegalStatusRequirements = {},
	action: Action
): LegalStatusRequirements {
	switch (action.type) {
		case 'COMPANY_IS_SOLE_PROPRIETORSHIP':
			return { ...state, soleProprietorship: action.isSoleProprietorship }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAS_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, autoEntrepreneur: action.autoEntrepreneur }
		case 'SPECIFY_DIRECTORS_SHARE':
			return { ...state, minorityDirector: action.minorityDirector }
		case 'RESET_COMPANY_STATUS_CHOICE':
			return action.answersToReset
				? action.answersToReset.reduce(omit, state)
				: {}
	}

	return state
}

function hiringChecklist(
	state: { [key: string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_HIRING_ITEM':
			return {
				...state,
				[action.name]: action.checked,
			}
		case 'INITIALIZE_HIRING_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		default:
			return state
	}
}

function companyCreationChecklist(
	state: { [key: string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_COMPANY_CREATION_ITEM':
			return {
				...state,
				[action.name]: action.checked,
			}
		case 'INITIALIZE_COMPANY_CREATION_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		case 'RESET_COMPANY_STATUS_CHOICE':
			return {}
		default:
			return state
	}
}

function companyStatusChoice(state: LegalStatus | null = null, action: Action) {
	if (action.type === 'RESET_COMPANY_STATUS_CHOICE') {
		return null
	}
	if (action.type !== 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
		return state
	}

	return action.statusName
}

const choixStatutJuridiqueReducer = combineReducers({
	companyLegalStatus,
	companyStatusChoice,
	companyCreationChecklist,
	hiringChecklist,
})

export default choixStatutJuridiqueReducer

export type ChoixStatutJuridiqueState = ReturnType<
	typeof choixStatutJuridiqueReducer
>
