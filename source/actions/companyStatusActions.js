/* @flow */
import type {
	ChooseCompanyLiabilityAction,
	CompanyLiability,
	CompanyHasMultipleAssociatesAction,
	DirectorStatus,
	CompanyIsMicroenterpriseAction,
	ResetCompanyStatusAction,
	DirectorIsInAMinorityAction,
	DefineDirectorStatusAction
} from 'Types/companyStatusTypes'
import type { RouterHistory } from 'react-router'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'

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

export const companyHasMultipleAssociates = thenGoToNextQuestion(
	(multipleAssociates: ?boolean): CompanyHasMultipleAssociatesAction => ({
		type: 'COMPANY_HAS_MULTIPLE_ASSOCIATES',
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

export const goToCompanyStatusChoice = () => (
	dispatch: ResetCompanyStatusAction => void,
	_: any,
	history: RouterHistory
) => {
	dispatch(
		({
			type: 'RESET_COMPANY_STATUS_CHOICE'
		}: ResetCompanyStatusAction)
	)
	history.push('/company')
}
