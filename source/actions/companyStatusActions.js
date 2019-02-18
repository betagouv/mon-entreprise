/* @flow */

import { dropWhile, last } from 'ramda'
import { nextQuestionUrlSelector } from 'Selectors/companyStatusSelectors'
import type {
	IsSoleProprietorshipAction,
	CompanyHasMultipleAssociatesAction,
	DirectorStatus,
	IsAutoentrepreneurAction,
	ResetCompanyStatusAction,
	DirectorIsInAMinorityAction,
	DefineDirectorStatusAction
} from 'Types/companyTypes'
import type { Thunk } from 'Types/ActionsTypes'

// Bug : last et dropline sont automatiquement enlevé par le formatOnSave de visual studio code sinon
// eslint-disable-next-line
let x = [dropWhile, last]

const thenGoToNextQuestion = actionCreator => (...args: any) =>
	((dispatch, getState, { history, sitePaths }) => {
		dispatch(actionCreator(...args))
		history.push(nextQuestionUrlSelector(getState(), { sitePaths }))
	}: Thunk<any>)

export const isSoleProprietorship = thenGoToNextQuestion(
	(isSoleProprietorship: ?boolean): IsSoleProprietorshipAction => ({
		type: 'COMPANY_IS_SOLE_PROPRIETORSHIP',
		isSoleProprietorship
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

export const isAutoentrepreneur = thenGoToNextQuestion(
	(autoEntrepreneur: ?boolean): IsAutoentrepreneurAction => ({
		type: 'COMPANY_IS_MICROENTERPRISE',
		autoEntrepreneur
	})
)

export const directorIsInAMinority = thenGoToNextQuestion(
	(minorityDirector: ?boolean): DirectorIsInAMinorityAction => ({
		type: 'SPECIFY_DIRECTORS_SHARE',
		minorityDirector
	})
)

export const goToCompanyStatusChoice = (): Thunk<ResetCompanyStatusAction> => (
	dispatch,
	_,
	{ history, sitePaths }
) => {
	dispatch(
		({
			type: 'RESET_COMPANY_STATUS_CHOICE'
		}: ResetCompanyStatusAction)
	)
	history.push(sitePaths.entreprise.index)
}

export const resetCompanyStatusChoice = (
	from: string
): Thunk<ResetCompanyStatusAction> => (dispatch, getState) => {
	const answeredQuestion = Object.keys(
		getState().inFranceApp.companyLegalStatus
	)
	const answersToReset = dropWhile(a => a !== from, answeredQuestion)
	if (!answersToReset.length) {
		return
	}
	dispatch({
		type: 'RESET_COMPANY_STATUS_CHOICE',
		answersToReset
	})
}

export const goBackToPreviousQuestion = (): Thunk<ResetCompanyStatusAction> => (
	dispatch,
	getState,
	{ history, sitePaths }
) => {
	const previousQuestion = last(
		Object.keys(getState().inFranceApp.companyLegalStatus)
	)
	if (previousQuestion) {
		dispatch({
			type: 'RESET_COMPANY_STATUS_CHOICE',
			answersToReset: [previousQuestion]
		})
	}
	history.push(
		sitePaths.entreprise.statutJuridique[previousQuestion || 'index']
	)
}
