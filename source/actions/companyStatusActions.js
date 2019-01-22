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
} from 'Types/companyTypes'
import { dropWhile, last } from 'ramda'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import sitePaths from '../sites/mycompanyinfrance.fr/sitePaths'
import type { RouterHistory } from 'react-router'

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
	(microEnterprise: ?boolean): CompanyIsMicroenterpriseAction => ({
		type: 'COMPANY_IS_MICROENTERPRISE',
		microEnterprise
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
	history.push(sitePaths().entreprise.index)
}

export const resetCompanyStatusChoice = (from: string) => (
	dispatch: ResetCompanyStatusAction => void,
	getState: () => any
) => {
	const answeredQuestion = Object.keys(
		getState().inFranceApp.companyLegalStatus
	)
	const answersToReset = dropWhile(a => a !== from, answeredQuestion)
	if (!answersToReset.length) {
		return
	}
	dispatch(
		({
			type: 'RESET_COMPANY_STATUS_CHOICE',
			answersToReset
		}: ResetCompanyStatusAction)
	)
}

export const goBackToPreviousQuestion = () => (
	dispatch: ResetCompanyStatusAction => void,
	getState: () => any,
	history: RouterHistory
) => {
	const previousQuestion = last(
		Object.keys(getState().inFranceApp.companyLegalStatus)
	)
	if (previousQuestion) {
		dispatch(
			({
				type: 'RESET_COMPANY_STATUS_CHOICE',
				answersToReset: [previousQuestion]
			}: ResetCompanyStatusAction)
		)
	}
	history.push(
		sitePaths().entreprise.statutJuridique[previousQuestion || 'index']
	)
}
