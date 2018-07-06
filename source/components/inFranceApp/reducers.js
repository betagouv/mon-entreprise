/* @flow */

import { combineReducers } from 'redux'
import type { Action, CompanyLegalStatus, State } from './types'

function companyLegalStatus(
	state: CompanyLegalStatus = {},
	action: Action
): CompanyLegalStatus {
	switch (action.type) {
		case 'CHOOSE_COMPANY_LEGAL_SETUP':
			return { ...state, legalSetup: action.setup }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAVE_MULTIPLE_ASSOCIATE':
			return { ...state, multipleAssociate: action.multipleAssociate }
	}
	return state
}

function companyCreationChecklist(
	state: { [string]: boolean } = {},
	action: Action
): { [string]: boolean } {
	switch (action.type) {
		case 'CHANGE_COMPANY_CREATION_CHECKLIST_ITEM':
			return { ...state, [action.name]: action.value }
		default:
			return state
	}
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

export default (combineReducers({
	companyLegalStatus,
	companyCreationChecklist,
	existingCompanyDetails
}): (State, Action) => State)
