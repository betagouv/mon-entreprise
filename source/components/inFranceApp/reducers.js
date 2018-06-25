/* @flow */

import { combineReducers } from 'redux'
import type { Action, CompanyLegalSetup } from './types'
function legalSetup(setup: ?CompanyLegalSetup = null, action: Action) {
	if (action.type !== 'SET_COMPANY_LEGAL_SETUP') {
		return setup
	}
	return action.setup
}
export default combineReducers({
	legalSetup: legalSetup
})
