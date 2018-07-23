/* @flow */

import type { State, CompanyLegalStatus } from 'Types/companyStatusTypes'
import {
	add,
	countBy,
	difference,
	filter,
	map,
	pick,
	sortBy,
	whereEq
} from 'ramda'

const LEGAL_STATUS_DETAILS: { [status: string]: CompanyLegalStatus } = {
	Microenterprise: {
		liability: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: true,
	},
	'Microenterprise (option EIRL)': {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: true
	},
	EI: {
		liability: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: false
	},
	EURL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: false
	},
	EIRL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: false
	},
	SARL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: true,
		microenterprise: false
	},
	SAS: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		microenterprise: false
	},
	SA: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		microenterprise: false
	},
	SNC: {
		liability: 'SOLE_PROPRIETORSHIP',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: true,
		microenterprise: false
	},
	SASU: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: false,
		microenterprise: false
	}
}
export type LegalStatus = $Keys<typeof LEGAL_STATUS_DETAILS>
const possibleStatus = (
	companyLegalStatus: CompanyLegalStatus
): { [LegalStatus]: boolean } =>
	map(
		// $FlowFixMe
		whereEq(filter(x => x !== null, companyLegalStatus)),
		LEGAL_STATUS_DETAILS
	)

export const possibleStatusSelector = (state: {
	inFranceApp: State
}): { [LegalStatus]: boolean } =>
	possibleStatus(state.inFranceApp.companyLegalStatus)

type Question = $Keys<CompanyLegalStatus>

const QUESTION_LIST: Array<Question> = Object.keys(LEGAL_STATUS_DETAILS.SA);
export const nextQuestionSelector = (state: {
	inFranceApp: State
}): ?Question => {
	const companyLegalStatus = state.inFranceApp.companyLegalStatus
	const questionAnswered = Object.keys(companyLegalStatus)
	const possibleStatusList = pick(
		Object.keys(filter(Boolean, possibleStatus(companyLegalStatus))),
		LEGAL_STATUS_DETAILS
	)

	const unansweredQuestions = difference(QUESTION_LIST, questionAnswered)
	const shannonEntropyByQuestion = unansweredQuestions.map(question => {
		const answerPopulation = Object.values(possibleStatusList).map(
			// $FlowFixMe
			status => status[question]
		)
		const frequencyOfAnswers = Object.values(
			countBy(x => x, answerPopulation)
		).map(
			numOccurrence =>
				// $FlowFixMe
				numOccurrence / answerPopulation.length
		)
		const shannonEntropy = -frequencyOfAnswers
			.map(p => p * Math.log2(p))
			// $FlowFixMe
			.reduce(add, 0)
		return [question, shannonEntropy]
	})
	const sortedPossibleNextQuestions = sortBy(
		([, entropy]) => -entropy,
		shannonEntropyByQuestion.filter(([, entropy]) => entropy !== 0)
	).map(([question]) => question)
	if (sortedPossibleNextQuestions.length === 0) {
		return null
	}
	return sortedPossibleNextQuestions[0]
}

export const nextQuestionUrlSelector = (state: { inFranceApp: State }) => {
	const nextQuestion = nextQuestionSelector(state)
	if (!nextQuestion) {
		return '/register/pick-legal-status'
	}
	return (
		'/register/' +
		nextQuestion
			.replace(/[^a-zA-Z0-9]+/g, '-')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/([0-9])([^0-9])/g, '$1-$2')
			.replace(/([^0-9])([0-9])/g, '$1-$2')
			.replace(/-+/g, '-')
			.toLowerCase()
	)
}
