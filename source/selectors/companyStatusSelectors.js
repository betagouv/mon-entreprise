/* @flow */

import type { State, LegalStatusRequirements } from 'Types/companyTypes'
import {
	add,
	any,
	countBy,
	difference,
	filter,
	flatten,
	isNil,
	map,
	mergeAll,
	mergeWith,
	pick,
	sortBy
} from 'ramda'
//TODO : use react context
import sitePaths from '../sites/mycompanyinfrance.fr/sitePaths'

const LEGAL_STATUS_DETAILS: {
	[status: string]: Array<LegalStatusRequirements> | LegalStatusRequirements
} = {
	'micro-entreprise': {
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microEnterprise: true
	},
	EIRL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		microEnterprise: false,
		minorityDirector: false
	},
	'micro-entreprise-EIRL': {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		minorityDirector: false,
		microEnterprise: true
	},
	EI: {
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microEnterprise: false
	},
	SASU: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		minorityDirector: false,
		multipleAssociates: false,
		microEnterprise: false
	},
	SAS: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		microEnterprise: false
	},
	SARL: [
		{
			liability: 'LIMITED_LIABILITY',
			directorStatus: 'SELF_EMPLOYED',
			multipleAssociates: true,
			minorityDirector: false,
			microEnterprise: false
		},
		{
			liability: 'LIMITED_LIABILITY',
			directorStatus: 'SALARIED',
			multipleAssociates: true,
			minorityDirector: true,
			microEnterprise: false
		}
	],
	EURL: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		microEnterprise: false
	},
	SA: {
		liability: 'LIMITED_LIABILITY',
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		microEnterprise: false
	},
	SNC: {
		liability: 'UNLIMITED_LIABILITY',
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: true,
		microEnterprise: false
	}
}

export type LegalStatus = $Keys<typeof LEGAL_STATUS_DETAILS>
type Question = $Keys<LegalStatusRequirements>

// $FlowFixMe
const QUESTION_LIST: Array<Question> = Object.keys(
	// $FlowFixMe
	mergeAll(flatten(Object.values(LEGAL_STATUS_DETAILS)))
)

const isCompatibleStatusWith = (answers: LegalStatusRequirements) => (
	statusRequirements: LegalStatusRequirements
): boolean => {
	const stringify = map(x => (!isNil(x) ? JSON.stringify(x) : x))
	// $FlowFixMe
	const answerCompatibility = Object.values(
		mergeWith(
			(answer, statusValue) =>
				isNil(answer) || isNil(statusValue) || answer === statusValue,
			// $FlowFixMe
			stringify(statusRequirements),
			// $FlowFixMe
			stringify(answers)
		)
	)
	const isCompatibleStatus = answerCompatibility.every(x => x !== false)
	return isCompatibleStatus
}
const possibleStatus = (
	answers: LegalStatusRequirements
): { [LegalStatus]: boolean } =>
	map(
		statusRequirements =>
			Array.isArray(statusRequirements)
				? any(isCompatibleStatusWith(answers), statusRequirements)
				: isCompatibleStatusWith(answers)(statusRequirements),
		LEGAL_STATUS_DETAILS
	)

export const possibleStatusSelector = (state: {
	inFranceApp: State
}): { [LegalStatus]: boolean } =>
	possibleStatus(state.inFranceApp.companyLegalStatus)

export const nextQuestionSelector = (state: {
	inFranceApp: State
}): ?Question => {
	const legalStatusRequirements = state.inFranceApp.companyLegalStatus
	const questionAnswered = Object.keys(legalStatusRequirements)
	const possibleStatusList = pick(
		Object.keys(filter(Boolean, possibleStatus(legalStatusRequirements))),
		LEGAL_STATUS_DETAILS
	)

	const unansweredQuestions = difference(QUESTION_LIST, questionAnswered)
	const shannonEntropyByQuestion = unansweredQuestions.map(question => {
		const answerPopulation = flatten(Object.values(possibleStatusList)).map(
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
	const paths = sitePaths()
	const nextQuestion = nextQuestionSelector(state)
	if (!nextQuestion) {
		return paths.entreprise.statusJuridique.liste
	}
	return paths.entreprise.statusJuridique[nextQuestion]
}

export  const régimeSelector = (state: { inFranceApp: State }): 'indépendant' | 'assimilé-salarié' | 'micro-entreprise' | null => {
	const companyStatusChoice = state.inFranceApp.companyStatusChoice
	const companyLegalStatus = state.inFranceApp.companyLegalStatus
	if (!companyStatusChoice) {
		return null;
	}
	if(companyStatusChoice === 'micro-entreprise') {

		return 'micro-entreprise'
	}
	if(companyStatusChoice.includes('EI') || companyStatusChoice === 'EURL' || companyStatusChoice === 'SARL' && companyLegalStatus?.minorityDirector === false) {
		return 'indépendant'
	}
	if(companyStatusChoice.includes('SAS') || companyStatusChoice === 'SARL' && companyLegalStatus?.minorityDirector === true) {
		return 'assimilé-salarié'
	}
	return null;
}