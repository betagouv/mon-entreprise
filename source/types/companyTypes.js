/* @flow */
import type { LegalStatus } from 'Selectors/companyStatusSelectors'

export type IsSoleProprietorshipAction = {
	type: 'COMPANY_IS_SOLE_PROPRIETORSHIP',
	isSoleProprietorship: ?boolean
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

export type IsAutoentrepreneurAction = {
	type: 'COMPANY_IS_MICROENTERPRISE',
	autoEntrepreneur: ?boolean
}

export type ChangeChecklistItemAction = {
	type: 'CHANGE_CHECKLIST_ITEM',
	checklist: string,
	value: boolean,
	name: string
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
		+soleProprietorship?: ?boolean,
		+directorStatus?: ?DirectorStatus,
		+multipleAssociates?: ?boolean,
		+autoEntrepreneur?: ?boolean,
		+minorityDirector?: ?boolean
	},
	+companyStatusChoice: ?LegalStatus
|}
export type LegalStatusRequirements = $PropertyType<State, 'companyLegalStatus'>
export type Action =
	| IsSoleProprietorshipAction
	| DefineDirectorStatusAction
	| IsAutoentrepreneurAction
	| CompanyHasMultipleAssociatesAction
	| ChangeChecklistItemAction
	| DirectorIsInAMinorityAction
	| ResetExistingCompanyDetailsAction
	| ResetCompanyStatusAction
