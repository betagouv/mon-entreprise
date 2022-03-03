import { FabriqueSocialEntreprise } from 'API/fabrique-social'
import { ApiCommuneJson } from 'Components/conversation/select/SelectCommune'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useNextQuestionUrl } from 'Selectors/companyStatusSelectors'
import { LegalStatusRequirements } from 'Types/companyTypes'
import { Action } from './actions'
import { addCommuneDetails, setCompany } from './existingCompanyActions'

export type CompanyStatusAction = ReturnType<
	| typeof isSoleProprietorship
	| typeof defineDirectorStatus
	| typeof companyHasMultipleAssociates
	| typeof isAutoentrepreneur
	| typeof directorIsInAMinority
	| typeof resetCompanyStatusChoice
>

// This feels hacky, we should express this "dispatch and navigate" in another way
export const useDispatchAndGoToNextQuestion = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const nextQuestion = useNextQuestionUrl()
	const [dispatched, setDispatched] = useState(false)
	useEffect(() => {
		if (dispatched) {
			history.push(nextQuestion)
		}
	}, [dispatched])
	return (action: Action) => {
		dispatch(action)
		setDispatched(true)
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

export const resetCompanyStatusChoice = (
	answersToReset?: (keyof LegalStatusRequirements)[]
) =>
	({
		type: 'RESET_COMPANY_STATUS_CHOICE',
		answersToReset,
	} as const)

const fetchCommuneDetails = async function (codeCommune: string) {
	const response = await fetch(
		`https://geo.api.gouv.fr/communes/${codeCommune}?fields=departement,region`
	)
	return await response.json()
}

export const useSetEntreprise = () => {
	const dispatch = useDispatch()
	return async (entreprise: FabriqueSocialEntreprise) => {
		if (entreprise === null) {
			return
		}
		dispatch(setCompany(entreprise))
		if (entreprise.firstMatchingEtablissement.is_siege) {
			const communeDetails: ApiCommuneJson = await fetchCommuneDetails(
				entreprise.firstMatchingEtablissement.codeCommuneEtablissement
			)
			dispatch(addCommuneDetails(communeDetails))
		}
	}
}
