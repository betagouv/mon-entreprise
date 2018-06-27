/* @flow */

export type CompanyLegalSetup = 'LIMITED_LIABILITY' | 'SOLE_PROPRIETORSHIP'
export type ChooseCompanyLegalSetupAction = {
	type: 'CHOOSE_COMPANY_LEGAL_SETUP',
	setup: CompanyLegalSetup
}

export type DirectorStatus = 'SALARIED' | 'SELF_EMPLOYED'

export type DefineDirectorStatusAction = {
	type: 'DEFINE_DIRECTOR_STATUS',
	status: DirectorStatus
}

export type CompanyHaveMultipleAssociateAction = {
	type: 'COMPANY_HAVE_MULTIPLE_ASSOCIATE',
	multipleAssociate: boolean
}

export type State = {|
	+companyLegalStatus: {
		+legalSetup?: CompanyLegalSetup,
		+directorStatus?: DirectorStatus,
		+multipleAssociate?: boolean
	}
|}
export type CompanyLegalStatus = $PropertyType<State, 'companyLegalStatus'>
export type Action =
	| ChooseCompanyLegalSetupAction
	| DefineDirectorStatusAction
	| CompanyHaveMultipleAssociateAction
