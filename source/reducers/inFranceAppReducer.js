/* @flow */

import { combineReducers } from 'redux'
import type {
	Action as CompanyStatusAction,
	CompanyLegalStatus,
	State
} from 'Types/companyStatusTypes'
import type {
	Action as CreationChecklistAction,
} from 'Types/companyCreationChecklistTypes'
type Action = CompanyStatusAction | CreationChecklistAction
function companyLegalStatus(
	state: CompanyLegalStatus = {},
	action: Action
): CompanyLegalStatus {
	switch (action.type) {
		case 'CHOOSE_COMPANY_LEGAL_SETUP':
			return { ...state, liability: action.setup }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAVE_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, microenterprise: action.microenterprise }
			case 'SPECIFY_DIRECTORS_SHARE':
		return { ...state, minorityDirector: action.minorityDirector }
	}
	return state
}

function companyCreationChecklist(
	state:  { [string]: boolean } =  {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_COMPANY_CREATION_ITEM':
			return {
				...state,
				[action.name]: action.checked
			}
		case 'INITIALIZE_COMPANY_CREATION_CHECKLIST':
			return action.checklistItems.reduce(
				(checklist, item) => ({...checklist, [item]: false })
			, {});
		default:
			return state
	}
}
function companyStatusChoice(
	state: ?string = null,
	action: Action
) {
	if (action.type !== 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
		return state;
	} 
	return action.statusName
}

function existingCompanyDetails(
	state: ?{ [string]: string } = null,
	action: Action
): ?{ [string]: string } {
	switch (action.type) {
		case 'SAVE_EXISTING_COMPANY_DETAILS':
			return action.details
		default:
			return state
	}
}

function companyRegistrationStarted(
	state: boolean = false,
	action: Action
) {
	if (action.type ==='START_COMPANY_REGISTRATION') {
		return true;
	}
	return state;
}

// $FlowFixMe
export default (combineReducers({
	companyLegalStatus,
	companyStatusChoice,
	companyCreationChecklist,
	companyRegistrationStarted,
	existingCompanyDetails
}): (State, Action) => State)
