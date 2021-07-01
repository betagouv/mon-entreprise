import { SitePaths, SitePathsContext } from 'Components/utils/SitePathsContext'
import {
	add,
	any,
	countBy,
	difference,
	flatten,
	isNil,
	keys,
	map,
	mergeAll,
	mergeWith,
	sortBy,
} from 'ramda'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { LegalStatusRequirements, State } from '../types/companyTypes'

const LEGAL_STATUS_DETAILS = {
	'auto-entrepreneur': {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: true,
	},
	EIRL: {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		autoEntrepreneur: false,
		minorityDirector: false,
	},
	'auto-entrepreneur-EIRL': {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		multipleAssociates: false,
		minorityDirector: false,
		autoEntrepreneur: true,
	},
	EI: {
		soleProprietorship: true,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false,
	},
	SASU: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false,
	},
	SAS: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		autoEntrepreneur: false,
	},
	SARL: [
		{
			soleProprietorship: false,
			directorStatus: 'SELF_EMPLOYED',
			multipleAssociates: true,
			minorityDirector: false,
			autoEntrepreneur: false,
		},
		{
			soleProprietorship: false,
			directorStatus: 'SALARIED',
			multipleAssociates: true,
			minorityDirector: true,
			autoEntrepreneur: false,
		},
	] as Array<LegalStatusRequirements>,
	EURL: {
		soleProprietorship: false,
		directorStatus: 'SELF_EMPLOYED',
		minorityDirector: false,
		multipleAssociates: false,
		autoEntrepreneur: false,
	},
	SA: {
		soleProprietorship: false,
		directorStatus: 'SALARIED',
		multipleAssociates: true,
		autoEntrepreneur: false,
	},
}

export type LegalStatus = keyof typeof LEGAL_STATUS_DETAILS
type Question = keyof LegalStatusRequirements

const QUESTION_LIST: Array<Question> = keys(
	mergeAll(flatten(Object.values(LEGAL_STATUS_DETAILS)))
)

const isCompatibleStatusWith =
	(answers: any) =>
	(statusRequirements: LegalStatusRequirements): boolean => {
		const stringify = map((x) => (!isNil(x) ? JSON.stringify(x) : x))
		const answerCompatibility = Object.values(
			mergeWith(
				(answer, statusValue) =>
					isNil(answer) || isNil(statusValue) || answer === statusValue,
				stringify(statusRequirements as any),
				stringify(answers)
			)
		)
		const isCompatibleStatus = answerCompatibility.every((x) => x !== false)
		return isCompatibleStatus
	}
const possibleStatus = (
	answers: Array<LegalStatusRequirements> | LegalStatusRequirements
): Record<LegalStatus, boolean> =>
	map(
		(statusRequirements) =>
			Array.isArray(statusRequirements)
				? any(isCompatibleStatusWith(answers as any), statusRequirements)
				: isCompatibleStatusWith(answers as any)(
						statusRequirements as LegalStatusRequirements
				  ),
		LEGAL_STATUS_DETAILS
	)

export const possibleStatusSelector = (state: {
	inFranceApp: State
}): Record<LegalStatus, boolean> =>
	possibleStatus(state.inFranceApp.companyLegalStatus)

export const nextQuestionSelector = (state: RootState): Question | null => {
	const legalStatusRequirements = state.inFranceApp.companyLegalStatus
	const questionAnswered = Object.keys(
		legalStatusRequirements
	) as Array<Question>
	const possibleStatusList = flatten(
		Object.values(LEGAL_STATUS_DETAILS)
	).filter(isCompatibleStatusWith(legalStatusRequirements) as any)

	const unansweredQuestions = difference(QUESTION_LIST, questionAnswered)
	const shannonEntropyByQuestion = unansweredQuestions.map(
		(question): [typeof question, number] => {
			const answerPopulation = Object.values(possibleStatusList).map(
				(status: any) => status[question]
			)
			const frequencyOfAnswers = Object.values(
				countBy(
					(x) => x,
					answerPopulation.filter((x) => x !== undefined)
				)
			).map((numOccurrence) => numOccurrence / answerPopulation.length)
			const shannonEntropy = -frequencyOfAnswers
				.map((p) => p * Math.log2(p))
				.reduce(add, 0)
			return [question, shannonEntropy]
		}
	)

	const sortedPossibleNextQuestions = sortBy(
		([, entropy]) => -entropy,
		shannonEntropyByQuestion.filter(([, entropy]) => entropy !== 0)
	).map(([question]) => question)
	if (sortedPossibleNextQuestions.length === 0) {
		return null
	}
	return sortedPossibleNextQuestions[0]
}

export const useNextQuestionUrl = () => {
	const nextQuestion = useSelector(nextQuestionSelector)
	const sitePaths = useContext(SitePathsContext)
	if (!nextQuestion) {
		return sitePaths.créer.guideStatut.liste
	}
	return sitePaths.créer.guideStatut[nextQuestion]
}
