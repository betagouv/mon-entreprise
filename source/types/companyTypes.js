/* @flow */

export type CompanyLiability = 'LIMITED_LIABILITY' | 'UNLIMITED_LIABILITY'

export type ChooseCompanyLiabilityAction = {
	type: 'CHOOSE_COMPANY_LEGAL_SETUP',
	setup: ?CompanyLiability
}

export type DirectorStatus = 'SALARIED' | 'SELF_EMPLOYED'

export type DefineDirectorStatusAction = {
	type: 'DEFINE_DIRECTOR_STATUS',
	status: ?DirectorStatus
}

export type CompanyHasMultipleAssociatesAction = {
	type: 'COMPANY_HAS_MULTIPLE_ASSOCIATES',
	multipleAssociates: ?boolean
}

export type CompanyIsMicroenterpriseAction = {
	type: 'COMPANY_IS_MICROENTERPRISE',
	microEnterprise: ?boolean
}

export type ChangeChecklistItemAction = {
	type: 'CHANGE_CHECKLIST_ITEM',
	checklist: string,
	value: boolean,
	name: string
}

export type ExistingCompanyDetails = {
	siret: string,
	effectif?: number,
	localisation?: Object,
	apiDetails: { [string]: string }
}
export type SaveExistingCompanyDetailsAction = {
	type: 'SAVE_EXISTING_COMPANY_DETAILS',
	details: ExistingCompanyDetails
}
export type DirectorIsInAMinorityAction = {
	type: 'SPECIFY_DIRECTORS_SHARE',
	minorityDirector: ?boolean
}
export type ResetCompanyStatusAction = {
	type: 'RESET_COMPANY_STATUS_CHOICE',
	answersToReset?: Array<string>
}
export type ResetExistingCompanyDetailsAction = {
	type: 'RESET_EXISTING_COMPANY_DETAILS'
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
		+microEnterprise?: ?boolean,
		+minorityDirector?: ?boolean
	},
	+existingCompanyDetails: ?ExistingCompanyDetails
|}
export type CompanyLegalStatus = $PropertyType<State, 'companyLegalStatus'>
export type Action =
	| ChooseCompanyLiabilityAction
	| DefineDirectorStatusAction
	| CompanyIsMicroenterpriseAction
	| CompanyHasMultipleAssociatesAction
	| SaveExistingCompanyDetailsAction
	| ChangeChecklistItemAction
	| DirectorIsInAMinorityAction
	| ResetExistingCompanyDetailsAction
	| ResetCompanyStatusAction
