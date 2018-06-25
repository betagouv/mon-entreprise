/* @flow */

export type CompanyLegalSetup = 'LIMITED_LIABILITY' | 'SOLE_PROPRIETORSHIP'
export type ChooseCompanyLegalSetupAction = {
	type: 'CHOOSE_COMPANY_LEGAL_SETUP',
	setup: CompanyLegalSetup
}

export type DirectorStatus = 'SALARIED' | 'SELF-EMPLOYED'

export type DefineDirectorStatusAction = {
	type: 'DEFINE_DIRECTOR_STATUS',
	status: DirectorStatus
}

export type State = {
	legalSetup: ?CompanyLegalSetup,
	status: ?DirectorStatus
}

export type Action = ChooseCompanyLegalSetupAction | DefineDirectorStatusAction
