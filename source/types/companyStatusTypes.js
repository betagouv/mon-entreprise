/* @flow */

export type CompanyLiability = 'LIMITED_LIABILITY' | 'SOLE_PROPRIETORSHIP'
export type ChooseCompanyLiabilityAction = {
	type: 'CHOOSE_COMPANY_LEGAL_SETUP',
	setup: ?CompanyLiability
}

export type DirectorStatus = 'SALARIED' | 'SELF_EMPLOYED'

export type DefineDirectorStatusAction = {
	type: 'DEFINE_DIRECTOR_STATUS',
	status: ?DirectorStatus
}

export type CompanyHaveMultipleAssociatesAction = {
	type: 'COMPANY_HAVE_MULTIPLE_ASSOCIATES',
	multipleAssociates: ?boolean
}


export type CompanyIsMicroenterpriseAction = {
	type: 'COMPANY_IS_MICROENTERPRISE',
	microenterprise: ?boolean
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
		/* 
			Note on the meanings of null / undefined value: 
			If the key exists and the value is null, the question have been asked, but skipped by the user.
		 	If the key does not exists, the question still hasn't been asked. 
		 */
		+liability?: ?CompanyLiability,
		+directorStatus?: ?DirectorStatus,
		+multipleAssociates?: ?boolean,
		+microenterprise?: ?boolean
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
	| CompanyIsMicroenterpriseAction
	| CompanyHaveMultipleAssociatesAction
	| SaveExistingCompanyDetailsAction
	| ChangeChecklistItemAction
