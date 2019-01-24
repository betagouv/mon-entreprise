/* @flow */

import { omit } from 'ramda'
import { combineReducers } from 'redux'
import type {
	Action as CompanyStatusAction,
	LegalStatusRequirements,
	ExistingCompanyDetails,
	State
} from 'Types/companyTypes'
import type { Action as CreationChecklistAction } from 'Types/companyCreationChecklistTypes'
import type { Action as HiringChecklist } from 'Types/hiringChecklistTypes'
type Action = CompanyStatusAction | CreationChecklistAction | HiringChecklist

function companyLegalStatus(
	state: LegalStatusRequirements = {},
	action: Action
): LegalStatusRequirements {
	switch (action.type) {
		case 'CHOOSE_COMPANY_LEGAL_SETUP':
			return { ...state, liability: action.setup }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAS_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, microEnterprise: action.microEnterprise }
		case 'SPECIFY_DIRECTORS_SHARE':
			return { ...state, minorityDirector: action.minorityDirector }
		case 'RESET_COMPANY_STATUS_CHOICE':
			return action.answersToReset ? omit(action.answersToReset, state) : {}
	}
	return state
}

function hiringChecklist(state: { [string]: boolean } = {}, action: Action) {
	switch (action.type) {
		case 'CHECK_HIRING_ITEM':
			return {
				...state,
				[action.name]: action.checked
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
	state: { [string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_COMPANY_CREATION_ITEM':
			return {
				...state,
				[action.name]: action.checked
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

function companyStatusChoice(state: ?string = null, action: Action) {
	if (
		['RESET_COMPANY_STATUS_CHOICE', 'RESET_EXISTING_COMPANY_DETAILS'].includes(
			action.type
		)
	) {
		return null
	}
	if (action.type === 'SAVE_EXISTING_COMPANY_DETAILS') {
		return action.details.legalStatus
	}
	if (action.type !== 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
		return state
	}
	return action.statusName
}

function existingCompanyDetails(
	state: ?ExistingCompanyDetails = null,
	action: Action
): ?ExistingCompanyDetails {
	switch (action.type) {
		case 'SAVE_EXISTING_COMPANY_DETAILS':
			return action.details
		case 'RESET_EXISTING_COMPANY_DETAILS':
			return null
		default:
			return state
	}
}
// $FlowFixMe
export default (combineReducers({
	companyLegalStatus,
	companyStatusChoice,
	companyCreationChecklist,
	existingCompanyDetails,
	hiringChecklist
}): (State, Action) => State)
