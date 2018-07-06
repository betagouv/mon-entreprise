/* @flow */

import { combineReducers } from 'redux'
import type { Action, CompanyLegalStatus } from './types'

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

export default combineReducers({
	companyLegalStatus,
	companyCreationChecklist
})
