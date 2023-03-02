import { useSelector } from 'react-redux'

import { useSitePaths } from '@/sitePaths'
import { RootState } from '@/store/reducers/rootReducer'
import { LegalStatusRequirements, State } from '@/types/companyTypes'

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
type Answers = LegalStatusRequirements

const QUESTION_LIST: Array<Question> = [
	'soleProprietorship',
	'directorStatus',
	'minorityDirector',
	'multipleAssociates',
	'autoEntrepreneur',
]

function isCompatibleStatusWith(
	answers: Answers,
	statusRequirements: LegalStatusRequirements
): boolean {
	return Object.entries(statusRequirements).reduce<boolean>(
		(isCompatible, [question, statusValue]) => {
			const answer = answers[question as Question]

			return (
				isCompatible &&
				(answer == null ||
					statusValue == null ||
					JSON.stringify(answer) === JSON.stringify(statusValue))
			)
		},
		true
	)
}

const possibleStatus = (answers: Answers): Record<LegalStatus, boolean> =>
	Object.fromEntries(
		Object.entries(LEGAL_STATUS_DETAILS).map(([key, statusRequirements]) => [
			key,
			Array.isArray(statusRequirements)
				? !!statusRequirements.some((requirement) =>
						isCompatibleStatusWith(answers, requirement)
				  )
				: isCompatibleStatusWith(
						answers,
						statusRequirements as LegalStatusRequirements
				  ),
		])
	) as Record<LegalStatus, boolean>

export const possibleStatusSelector = (state: {
	choixStatutJuridique: State
}): Record<LegalStatus, boolean> =>
	possibleStatus(state.choixStatutJuridique.companyLegalStatus)

export const nextQuestionSelector = (state: RootState): Question | null => {
	const legalStatusRequirements = state.choixStatutJuridique.companyLegalStatus
	const questionAnswered = Object.keys(
		legalStatusRequirements
	) as Array<Question>
	const possibleStatusList = Object.values(LEGAL_STATUS_DETAILS)
		.flat()
		.filter((requirement) =>
			isCompatibleStatusWith(legalStatusRequirements, requirement as any)
		)

	const difference = <T>(l1: Array<T>, l2: Array<T>): Array<T> =>
		l1.filter((x) => !l2.includes(x))

	const unansweredQuestions = difference(QUESTION_LIST, questionAnswered)
	const shannonEntropyByQuestion = unansweredQuestions.map(
		(question): [typeof question, number] => {
			const answerPopulation = Object.values(possibleStatusList).map(
				(status: any) => status[question]
			)

			const frequencyOfAnswers = Object.values<number>(
				answerPopulation
					.filter((x) => x !== undefined)
					.reduce(
						(counters: Record<string, number>, i) => ({
							...counters,
							[i]: (counters?.[i] ?? 0) + 1,
						}),
						{}
					)
			).map((numOccurrence) => numOccurrence / answerPopulation.length)
			const shannonEntropy = -frequencyOfAnswers
				.map((p) => p * Math.log2(p))
				.reduce((a, b) => a + b, 0)

			return [question, shannonEntropy]
		}
	)

	const sortedPossibleNextQuestions = shannonEntropyByQuestion
		.filter(([, entropy]) => entropy !== 0)
		.sort(([, entropy1], [, entropy2]) => entropy2 - entropy1)
		.map(([question]) => question)

	if (sortedPossibleNextQuestions.length === 0) {
		return null
	}

	return sortedPossibleNextQuestions[0]
}

export const useNextQuestionUrl = () => {
	const nextQuestion = useSelector(nextQuestionSelector)
	const { absoluteSitePaths } = useSitePaths()
	if (!nextQuestion) {
		return absoluteSitePaths.assistants['choix-du-statut'].guideStatut.liste
	}

	return absoluteSitePaths.assistants['choix-du-statut'].guideStatut[
		nextQuestion
	]
}
