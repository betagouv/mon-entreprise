/* @flow */

export type CompanyLiability = 'LIMITED_LIABILITY' | 'SOLE_PROPRIETORSHIP'
export type ChooseCompanyLiabilityAction = {
	type: 'CHOOSE_COMPANY_LEGAL_SETUP',
	setup: CompanyLiability
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

export type ChangeChecklistItemAction = {
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
		+liability?: CompanyLiability,
		+directorStatus?: DirectorStatus,
		+multipleAssociate?: boolean
	},
	+existingCompanyDetails: ?{ [string]: string },
	+checklists: {
		+register: {
			[string]: boolean
		},
		+hire: { [string]: boolean }
	}
|}
export type CompanyLegalStatus = $PropertyType<State, 'companyLegalStatus'>
export type Action =
	| ChooseCompanyLiabilityAction
	| DefineDirectorStatusAction
	| CompanyHaveMultipleAssociateAction
	| SaveExistingCompanyDetailsAction
	| ChangeChecklistItemAction
