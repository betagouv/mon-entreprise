/* @flow */

import type {
	State,
	CompanyLegalStatus,
	DirectorStatus
} from 'Types/companyStatusTypes'
import { map, whereEq } from 'ramda'

const LEGAL_STATUS_DETAILS: { [status: string]: CompanyLegalStatus } = {
	EI: {
		legalSetup: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EURL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	EIRL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: false
	},
	SARL: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SAS: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SA: {
		legalSetup: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociate: true
	},
	SNC: {
		legalSetup: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociate: true
	},
	SASU: {
		legalSetup: 'LIMITED_LIABILITY',
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
