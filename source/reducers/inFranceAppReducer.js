/* @flow */

import { omit } from 'ramda'
import { combineReducers } from 'redux'
import type {
	Action as CompanyStatusAction,
	LegalStatusRequirements,
	State
} from 'Types/companyTypes'
import type { Action as CreationChecklistAction } from 'Types/companyCreationChecklistTypes'
import type { Action as HiringChecklist } from 'Types/hiringChecklistTypes'
type Action = CompanyStatusAction | CreationChecklistAction | HiringChecklist

function companyLegalStatus(
	state: LegalStatusRequirements = {},
	action: Action
): LegalStatusRequirements {
	switch (action.type) {
		case 'COMPANY_IS_SOLE_PROPRIETORSHIP':
			return { ...state, soleProprietorship: action.isSoleProprietorship }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAS_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, autoEntrepreneur: action.autoEntrepreneur }
		case 'SPECIFY_DIRECTORS_SHARE':
			return { ...state, minorityDirector: action.minorityDirector }
		case 'RESET_COMPANY_STATUS_CHOICE':
			return action.answersToReset ? omit(action.answersToReset, state) : {}
	}
	return state
}

function hiringChecklist(state: { [string]: boolean } = {}, action: Action) {
	switch (action.type) {
		case 'CHECK_HIRING_ITEM':
			return {
				...state,
				[action.name]: action.checked
			}
		case 'INITIALIZE_HIRING_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		default:
			return state
	}
}

function companyCreationChecklist(
	state: { [string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_COMPANY_CREATION_ITEM':
			return {
				...state,
				[action.name]: action.checked
			}
		case 'INITIALIZE_COMPANY_CREATION_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		case 'RESET_COMPANY_STATUS_CHOICE':
			return {}
		default:
			return state
	}
}

function companyStatusChoice(state: ?string = null, action: Action) {
	if (action.type === 'RESET_COMPANY_STATUS_CHOICE') {
		return null
	}
	if (action.type !== 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
		return state
	}
	return action.statusName
}

const infereLegalStatusFromCategorieJuridique = catégorieJuridique => {
	/*
	Nous utilisons le code entreprise pour connaitre le statut juridique
	(voir https://www.insee.fr/fr/information/2028129)

	En revanche, impossible de différencier EI et auto-entreprise
	https://www.sirene.fr/sirene/public/question.action?idQuestion=2933
	*/

	if (catégorieJuridique === '1000') {
		return 'EI'
	}
	if (catégorieJuridique === '5498') {
		return 'EURL'
	}
	if (catégorieJuridique.match(/^54..$/)) {
		return 'SARL'
	}
	if (catégorieJuridique.match(/^55..$/)) {
		return 'SA'
	}
	if (catégorieJuridique === '5720') {
		return 'SASU'
	}
	if (catégorieJuridique.match(/^57..$/)) {
		return 'SAS'
	}
	return 'NON_IMPLÉMENTÉ'
}
function existingCompany(
	state: ?{
		siren: string,
		catégorieJuridique: ?string,
		statutJuridique: string
	} = null,
	action
) {
	if (!action.type.startsWith('EXISTING_COMPANY::')) {
		return state
	}
	if (action.type.endsWith('RESET')) {
		return null
	}
	if (action.type.endsWith('SET_SIREN')) {
		return { siren: action.siren }
	}
	if (state && action.type.endsWith('SET_CATEGORIE_JURIDIQUE')) {
		const statutJuridique = infereLegalStatusFromCategorieJuridique(
			action.catégorieJuridique
		)
		return {
			siren: state.siren,
			statutJuridique
		}
	}
	if (state && action.type.endsWith('SPECIFY_AUTO_ENTREPRENEUR')) {
		return { ...state, isAutoEntrepreneur: action.isAutoEntrepreneur }
	}

	return state
}

// $FlowFixMe
export default (combineReducers({
	companyLegalStatus,
	companyStatusChoice,
	companyCreationChecklist,
	existingCompany,
	hiringChecklist
}): (State, Action) => State)
