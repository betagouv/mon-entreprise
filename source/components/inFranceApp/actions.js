/* @flow */
import type { CompanyLegalSetup, SetCompanyLegalSetupAction } from './types'

export function setCompanyLegalSetup(
	setup: CompanyLegalSetup
): SetCompanyLegalSetupAction {
	return {
		type: 'SET_COMPANY_LEGAL_SETUP',
		setup
	}
}
