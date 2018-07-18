/* @flow */

import type {
	State,
	CompanyLegalStatus,
	DirectorStatus
} from 'Types/companyStatusTypes'
import { map, whereEq } from 'ramda'

const LEGAL_STATUS_DETAILS: { [status: string]: CompanyLegalStatus } = {
	EI: {
		liability: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EURL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EIRL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	SARL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SAS: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SA: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SNC: {
		liability: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SASU: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	}
}
export type LegalStatus = $Keys<typeof LEGAL_STATUS_DETAILS>
const possibleStatus = (
	companyLegalStatus: CompanyLegalStatus
): { [LegalStatus]: boolean } =>
	// $FlowFixMe
	map(whereEq(companyLegalStatus), LEGAL_STATUS_DETAILS)

export const possibleStatusSelector = (state: {
	inFranceApp: State
}): { [LegalStatus]: boolean } =>
	possibleStatus(state.inFranceApp.companyLegalStatus)

export const disabledDirectorStatusSelector = (state: {
	inFranceApp: State
}): Array<DirectorStatus> =>
	['SALARIED', 'SELF_EMPLOYED'].filter(directorStatus =>
		Object.values(
			possibleStatus({
				...state.inFranceApp.companyLegalStatus,
				directorStatus
			})
		).every(x => x === false)
	)
