/* @flow */

import { combineReducers } from 'redux'
import type { Action, CompanyLegalSetup, DirectorStatus } from './types'
function legalSetup(setup: ?CompanyLegalSetup = null, action: Action) {
	if (action.type !== 'CHOOSE_COMPANY_LEGAL_SETUP') {
		return setup
	}
	return action.setup
}
function directorStatus(
	directorStatus: ?DirectorStatus = null,
	action: Action
) {
	if (action.type !== 'DEFINE_DIRECTOR_STATUS') {
		return directorStatus
	}
	return action.status
}

function multipleAssociate(multipleAssociate: ?boolean = null, action: Action) {
	if (action.type !== 'COMPANY_HAVE_MULTIPLE_ASSOCIATE') {
		return multipleAssociate
	}
	return action.multipleAssociate
}

export default combineReducers({
	legalSetup,
	directorStatus,
	multipleAssociate
})
