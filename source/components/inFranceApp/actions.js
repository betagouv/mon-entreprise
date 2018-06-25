/* @flow */
import type {
	ChooseCompanyLegalSetupAction,
	CompanyLegalSetup,
	DirectorStatus,
	DefineDirectorStatusAction
} from './types'

export function chooseCompanyLegalSetup(
	setup: CompanyLegalSetup
): ChooseCompanyLegalSetupAction {
	return {
		type: 'CHOOSE_COMPANY_LEGAL_SETUP',
		setup
	}
}

export function defineCompanyStatus(
	status: DirectorStatus
): DefineDirectorStatusAction {
	return {
		type: 'DEFINE_DIRECTOR_STATUS',
		status
	}
}
