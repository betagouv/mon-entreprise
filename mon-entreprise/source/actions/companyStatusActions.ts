import { dropWhile } from 'ramda'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useNextQuestionUrl } from 'Selectors/companyStatusSelectors'
import { Action, ThunkResult } from './actions'

export type CompanyStatusAction =
	| CompanyIsSoleProprietorshipAction
	| DefineDirectorStatusAction
	| MultipleAssociatesAction
	| CompanyIsMicroentrepriseAction
	| SpecifyDirectorsShareAction
	| ResetCompanyStatusChoiceAction

type CompanyIsSoleProprietorshipAction = {
	type: 'COMPANY_IS_SOLE_PROPRIETORSHIP'
	isSoleProprietorship?: boolean
}

type DefineDirectorStatusAction = {
	type: 'DEFINE_DIRECTOR_STATUS'
	status: DirectorStatus
}

type MultipleAssociatesAction = {
	type: 'COMPANY_HAS_MULTIPLE_ASSOCIATES'
	multipleAssociates?: boolean
}

type CompanyIsMicroentrepriseAction = {
	type: 'COMPANY_IS_MICROENTERPRISE'
	autoEntrepreneur?: boolean
}

type SpecifyDirectorsShareAction = {
	type: 'SPECIFY_DIRECTORS_SHARE'
	minorityDirector?: boolean
}

type ResetCompanyStatusChoiceAction = {
	type: 'RESET_COMPANY_STATUS_CHOICE'
	answersToReset?: string[]
}

export const useDispatchAndGoToNextQuestion = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const nextQuestion = useNextQuestionUrl()
	return (action: Action) => {
		dispatch(action)
		history.push(nextQuestion)
	}
}

export const isSoleProprietorship = (isSoleProprietorship?: boolean) =>
	({
		type: 'COMPANY_IS_SOLE_PROPRIETORSHIP',
		isSoleProprietorship,
	} as const)

type DirectorStatus = 'SALARIED' | 'SELF_EMPLOYED'

export const defineDirectorStatus = (status: DirectorStatus) =>
	({
		type: 'DEFINE_DIRECTOR_STATUS',
		status,
	} as const)

export const companyHasMultipleAssociates = (multipleAssociates?: boolean) =>
	({
		type: 'COMPANY_HAS_MULTIPLE_ASSOCIATES',
		multipleAssociates,
	} as const)

export const isAutoentrepreneur = (autoEntrepreneur?: boolean) =>
	({
		type: 'COMPANY_IS_MICROENTERPRISE',
		autoEntrepreneur,
	} as const)

export const directorIsInAMinority = (minorityDirector?: boolean) =>
	({
		type: 'SPECIFY_DIRECTORS_SHARE',
		minorityDirector,
	} as const)

export const resetCompanyStatusChoice = (answersToReset?: string[]) =>
	({
		type: 'RESET_COMPANY_STATUS_CHOICE',
		answersToReset,
	} as const)
