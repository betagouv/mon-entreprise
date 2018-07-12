/* @flow */
import type {
	ChooseCompanyLegalSetupAction,
	CompanyLegalSetup,
	CompanyHaveMultipleAssociateAction,
	DirectorStatus,
	DefineDirectorStatusAction
} from 'Types/companyStatusTypes'

export function chooseCompanyLegalSetup(
	setup: CompanyLegalSetup
): ChooseCompanyLegalSetupAction {
	return {
		type: 'CHOOSE_COMPANY_LEGAL_SETUP',
		setup
	}
}

export function defineDirectorStatus(
	status: DirectorStatus
): DefineDirectorStatusAction {
	return {
		type: 'DEFINE_DIRECTOR_STATUS',
		status
	}
}

export function companyHaveMultipleAssociate(
	multipleAssociate: boolean
): CompanyHaveMultipleAssociateAction {
	return {
		type: 'COMPANY_HAVE_MULTIPLE_ASSOCIATE',
		multipleAssociate
	}
}
