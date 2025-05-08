import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'

import { ValeurPublicodes } from '@/domaine/engine/RèglePublicodeAdapter'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'
import { LocationDeMeubleAction } from '@/store/slices/locationDeMeubleSlice'
import { buildSituationFromObject } from '@/utils/publicodes'

import { CompanyActions } from './companyActions'
import { HiringChecklistAction } from './hiringChecklistAction'

export type Action =
	| ReturnType<
			| typeof explainVariable
			| typeof vaÀLaQuestion
			| typeof hideNotification
			| typeof loadPreviousSimulation
			| typeof resetSimulation
			| typeof setActiveTarget
			| typeof setSimulationConfig
			| typeof retourneÀLaQuestionPrécédente
			| typeof vaÀLaQuestionSuivante
			| typeof ajusteLaSituation
			| typeof enregistreLaRéponse
			| typeof enregistreLesRéponses
			| typeof deleteFromSituation
			| typeof updateUnit
			| typeof batchUpdateSituation
			| typeof questionsSuivantes
			| typeof applicabilitéDesQuestionsRépondues
			| typeof miseÀJourSituation
	  >
	| CompanyActions
	| HiringChecklistAction
	| LocationDeMeubleAction

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION',
	}) as const

export const vaÀLaQuestion = (question: DottedName) =>
	({
		type: 'VA_À_LA_QUESTION',
		question,
	}) as const

export const questionsSuivantes = (questionsSuivantes: Array<DottedName>) =>
	({
		type: 'QUESTIONS_SUIVANTES',
		questionsSuivantes,
	}) as const

export const setSimulationConfig = (config: SimulationConfig, url: string) =>
	({
		type: 'SET_SIMULATION',
		url,
		config,
	}) as const

export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName,
	}) as const

export const ajusteLaSituation = <T extends DottedName>(
	amendement: Record<T, ValeurPublicodes | undefined>
) =>
	({
		type: 'AJUSTE_LA_SITUATION',
		amendement,
	}) as const

export const enregistreLaRéponse = (
	fieldName: DottedName,
	value: ValeurPublicodes | undefined
) =>
	value === undefined
		? deleteFromSituation(fieldName)
		: ({
				type: 'ENREGISTRE_LA_RÉPONSE',
				fieldName,
				value,
		  } as const)

export const enregistreLesRéponses = (
	règle: DottedName,
	valeurs: Record<string, ValeurPublicodes>
) =>
	({
		type: 'ENREGISTRE_LES_RÉPONSES',
		règle,
		valeurs,
	}) as const

export const deleteFromSituation = (fieldName: DottedName) =>
	({
		type: 'DELETE_FROM_SITUATION',
		fieldName,
	}) as const

export const batchUpdateSituation = (
	situation: NonNullable<Parameters<Engine<DottedName>['setSituation']>[0]>
) =>
	({
		type: 'BATCH_UPDATE_SITUATION',
		situation,
	}) as const

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
	}) as const

export function loadPreviousSimulation() {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION',
	} as const
}

export function hideNotification(id: string) {
	return { type: 'HIDE_NOTIFICATION', id } as const
}

export const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	}) as const

export const retourneÀLaQuestionPrécédente = () =>
	({
		type: 'RETOURNE_À_LA_QUESTION_PRÉCÉDENTE',
	}) as const

export const vaÀLaQuestionSuivante = () =>
	({
		type: 'VA_À_LA_QUESTION_SUIVANTE',
	}) as const

export const applicabilitéDesQuestionsRépondues = (
	questionsRépondues: Array<QuestionRépondue>
) =>
	({
		type: 'APPLICABILITÉ_DES_QUESTIONS_RÉPONDUES',
		questionsRépondues,
	}) as const

export const answerBatchQuestion = (
	dottedName: DottedName,
	value: Record<string, PublicodesExpression>
) => batchUpdateSituation(buildSituationFromObject(dottedName, value))

export const miseÀJourSituation = (situation: SituationPublicodes) =>
	({
		type: 'MISE_À_JOUR_SITUATION',
		payload: { situation },
	}) as const
