/* @flow */
import type {
	ChooseCompanyLiabilityAction,
	CompanyLiability,
	CompanyHaveMultipleAssociatesAction,
	DirectorStatus,
	CompanyIsMicroenterpriseAction,
	StartCompanyRegistrationAction,
	DirectorIsInAMinorityAction,
	DefineDirectorStatusAction
} from 'Types/companyStatusTypes'
import type { RouterHistory } from 'react-router'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import { ThunkAction } from 'redux-thunk';

const thenGoToNextQuestion = actionCreator => (...args: any) => (
	dispatch: any => void,
	getState: () => any,
	history: RouterHistory
) => {
	dispatch(actionCreator(...args))
	history.push(nextQuestionUrlSelector(getState()))
}

export const chooseCompanyLiability = thenGoToNextQuestion(
	(setup: ?CompanyLiability): ChooseCompanyLiabilityAction => ({
		type: 'CHOOSE_COMPANY_LEGAL_SETUP',
		setup
	})
)

export const defineDirectorStatus = thenGoToNextQuestion(
	(status: ?DirectorStatus): DefineDirectorStatusAction => ({
		type: 'DEFINE_DIRECTOR_STATUS',
		status
	})
)

export const companyHaveMultipleAssociates = thenGoToNextQuestion(
	(multipleAssociates: ?boolean): CompanyHaveMultipleAssociatesAction => ({
		type: 'COMPANY_HAVE_MULTIPLE_ASSOCIATES',
		multipleAssociates
	})
)

export const companyIsMicroenterprise = thenGoToNextQuestion(
	(microenterprise: ?boolean): CompanyIsMicroenterpriseAction => ({
		type: 'COMPANY_IS_MICROENTERPRISE',
		microenterprise
	})
)

export const directorIsInAMinority = thenGoToNextQuestion(
	(minorityDirector: ?boolean): DirectorIsInAMinorityAction => ({
		type: 'SPECIFY_DIRECTORS_SHARE',
		minorityDirector
	})
)
export const startCompanyRegistration= () => ((dispatch, _, history)  => {
	dispatch(({
		type: 'START_COMPANY_REGISTRATION',
	}: StartCompanyRegistrationAction))
	history.push('/company/registration-pending')
}:ThunkAction )