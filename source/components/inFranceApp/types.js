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

export type ChangeCheckListItemAction = {
	type: 'CHANGE_CHECKLIST_ITEM',
	checklist: string,
	value: boolean,
	name: string
}

export type SaveExistingCompanyDetailsAction = {
	type: 'SAVE_EXISTING_COMPANY_DETAILS',
	details: { [string]: string }
}

export type State = {|
	+companyLegalStatus: {
		+legalSetup?: CompanyLegalSetup,
		+directorStatus?: DirectorStatus,
		+multipleAssociate?: boolean
	},
	+companyCreationChecklist: {
		[string]: boolean
	},
	+existingCompanyDetails: ?{ [string]: string }
|}
export type CompanyLegalStatus = $PropertyType<State, 'companyLegalStatus'>
export type Action =
	| ChooseCompanyLegalSetupAction
	| DefineDirectorStatusAction
	| CompanyHaveMultipleAssociateAction
	| ChangeCompanyCreationChecklistItemAction
	| SaveExistingCompanyDetailsAction
