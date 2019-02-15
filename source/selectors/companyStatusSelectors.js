/* @flow */

import type { State, LegalStatusRequirements } from 'Types/companyTypes'
import type { SitePaths } from 'Components/utils/withSitePaths'
import {
	add,
	any,
	countBy,
	difference,
	flatten,
	isNil,
	map,
	mergeAll,
	mergeWith,
	sortBy
} from 'ramda'

const LEGAL_STATUS_DETAILS: {
	[status: string]: Array<LegalStatusRequirements> | LegalStatusRequirements
} = {
	'auto-entrepreneur': {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: true
	},
	EIRL: {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		autoEntrepreneur: false,
		minorityDirector: false
	},
	'auto-entrepreneur-EIRL': {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		minorityDirector: false,
		autoEntrepreneur: true
	},
	EI: {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false
	},
	SASU: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false
	},
	SAS: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		autoEntrepreneur: false
	},
	SARL: ([
		{
			soleProprietorship: false,
			directorStatus: 'SELF_EMPLOYED',
			multipleAssociates: true,
			minorityDirector: false,
			autoEntrepreneur: false
		},
		{
			soleProprietorship: false,
			directorStatus: 'SALARIED',
			multipleAssociates: true,
			minorityDirector: true,
			autoEntrepreneur: false
		}
	]: Array<LegalStatusRequirements>),
	EURL: {
		soleProprietorship: false,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false
	},
	SA: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		autoEntrepreneur: false
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
	const answerCompatibility = Object.values(
		mergeWith(
			(answer, statusValue) =>
				isNil(answer) || isNil(statusValue) || answer === statusValue,
			stringify(statusRequirements),
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
	const possibleStatusList = flatten(
		Object.values(LEGAL_STATUS_DETAILS)
		// $FlowFixMe
	).filter(isCompatibleStatusWith(legalStatusRequirements))

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

export const nextQuestionUrlSelector = (
	state: { inFranceApp: State },
	{ sitePaths }: { sitePaths: SitePaths }
) => {
	const nextQuestion = nextQuestionSelector(state)
	if (!nextQuestion) {
		return sitePaths.entreprise.statutJuridique.liste
	}
	return sitePaths.entreprise.statutJuridique[nextQuestion]
}

export const régimeSelector = (state: {
	inFranceApp: State
}): 'indépendant' | 'assimilé-salarié' | 'auto-entrepreneur' | null => {
	const companyStatusChoice = state.inFranceApp.companyStatusChoice
	const companyLegalStatus = state.inFranceApp.companyLegalStatus
	if (!companyStatusChoice) {
		if (companyLegalStatus.autoEntrepreneur === true) {
			return 'auto-entrepreneur'
		}
		if (companyLegalStatus.directorStatus === 'SALARIED') {
			return 'assimilé-salarié'
		}
		if (companyLegalStatus.directorStatus === 'SELF_EMPLOYED') {
			return 'indépendant'
		}
		return null
	}
	if (companyStatusChoice.includes('auto-entrepreneur')) {
		return 'auto-entrepreneur'
	}
	if (
		companyStatusChoice.includes('EI') ||
		companyStatusChoice === 'EURL' ||
		(companyStatusChoice === 'SARL' &&
			companyLegalStatus?.minorityDirector === false)
	) {
		return 'indépendant'
	}
	if (
		companyStatusChoice.includes('SAS') ||
		(companyStatusChoice === 'SARL' &&
			companyLegalStatus?.minorityDirector === true)
	) {
		return 'assimilé-salarié'
	}
	return null
}
