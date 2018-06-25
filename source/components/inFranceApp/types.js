/* @flow */

export type SetCompanyLegalSetupAction = {
	type: 'SET_COMPANY_LEGAL_SETUP',
	setup: CompanyLegalSetup
}
export type CompanyLegalSetup = 'LIMITED_LIABILITY' | 'SOLE_PROPRIETORSHIP'
export type State = {
	legalSetup: ?CompanyLegalSetup
}

export type Action = SetCompanyLegalSetupAction
