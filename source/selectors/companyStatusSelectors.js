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
	mergeWith,
	isNil,
} from 'ramda'

const LEGAL_STATUS_DETAILS: { [status: string]: CompanyLegalStatus } = {
	Microenterprise: {
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microenterprise: true,
	},
	'Microenterprise (option EIRL)': {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		minorityDirector: false,
		microenterprise: true
	},
	EI: {
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microenterprise: false
	},
	EURL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microenterprise: false
	},
	EIRL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microenterprise: false,
		minorityDirector: false,
	},
	'SARL (majority director)': {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: true,
		minorityDirector: false,
		microenterprise: false
	},
	'SARL (minority director)': {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		minorityDirector: true,
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
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: true,
		microenterprise: false
	},
	SASU: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		minorityDirector: false,
		multipleAssociates: false,
		microenterprise: false
	}
}

export type LegalStatus = $Keys<typeof LEGAL_STATUS_DETAILS>
const QUESTION_LIST: Array<Question> = Object.keys(LEGAL_STATUS_DETAILS['SARL (minority director)']);

const isCompatibleStatusWith = 
	(answers: CompanyLegalStatus) => (status: CompanyLegalStatus) : boolean =>  {
		const stringify = map(x => !isNil(x) ? JSON.stringify(x) : x)
		// $FlowFixMe
		const answerCompatibility = Object.values(mergeWith((answer, statusValue) => (  isNil(answer) || isNil(statusValue) || answer === statusValue), stringify(status), stringify(answers)))
		const isCompatibleStatus = answerCompatibility.every(x => x !== false);
		return isCompatibleStatus
	}
const possibleStatus = (
	answers: CompanyLegalStatus
): { [LegalStatus]: boolean } =>
	map(
		// $FlowFixMe
		isCompatibleStatusWith(answers),
		LEGAL_STATUS_DETAILS
	)

export const possibleStatusSelector = (state: {
	inFranceApp: State
}): { [LegalStatus]: boolean } =>
	possibleStatus(state.inFranceApp.companyLegalStatus)

type Question = $Keys<CompanyLegalStatus>

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
			countBy(x => x, answerPopulation.filter(x => x !== undefined))
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
		return '/company/legal-status/pick-legal-status'
	}
	return (
		'/company/legal-status/' +
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
