import * as O from 'effect/Option'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'

import { CompanyActions } from './companyActions'

export type Action =
	| ReturnType<
			| typeof configureLaSimulation
			| typeof réinitialiseLaSimulation
			| typeof chargeLaSimulationPrécédente
			| typeof ajusteLaSituation
			| typeof enregistreLaRéponseÀLaQuestion
			| typeof enregistreLesRéponsesÀLaQuestion
			| typeof enregistreLesRéponsesAuxQuestions
			| typeof supprimeLaRègleDeLaSituation
			| typeof retourneÀLaQuestionPrécédente
			| typeof vaÀLaQuestionSuivante
			| typeof vaÀLaQuestion
			| typeof applicabilitéDesQuestionsRépondues
			| typeof metÀJourLesQuestionsSuivantes
			| typeof updateUnit
			| typeof hideNotification
			| typeof setActiveTarget
	  >
	| CompanyActions

// Configuration de la simulation

export const configureLaSimulation = (
	config: SimulationConfig,
	url: string,
	key: string
) =>
	({
		type: 'CONFIGURE_LA_SIMULATION',
		url,
		config,
		key,
	}) as const

// Initialisation de la simulation

export const réinitialiseLaSimulation = () =>
	({
		type: 'RÉINITIALISE_LA_SIMULATION',
	}) as const

export function chargeLaSimulationPrécédente() {
	return {
		type: 'CHARGE_LA_SIMULATION_PRÉCÉDENTE',
	} as const
}

// Modification de la situation

/**
 * Modifie la situation, sans modifier la liste des questions répondues
 */
export const ajusteLaSituation = (
	amendement: Record<DottedName, ValeurPublicodes | undefined>
) =>
	({
		type: 'AJUSTE_LA_SITUATION',
		amendement,
	}) as const

/**
 * Modifie la situation et la liste des question répondues
 */
export const enregistreLaRéponseÀLaQuestion = (
	fieldName: DottedName,
	value: ValeurPublicodes | undefined
) =>
	value === undefined
		? supprimeLaRègleDeLaSituation(fieldName)
		: ({
				type: 'ENREGISTRE_LA_RÉPONSE_À_LA_QUESTION',
				fieldName,
				value,
		  } as const)

/**
 * Modifie la situation et la liste des questions répondues,
 * pour une question de type "plusieurs possibilités"
 */
export const enregistreLesRéponsesÀLaQuestion = (
	règle: DottedName,
	valeurs: Record<string, ValeurPublicodes>
) =>
	({
		type: 'ENREGISTRE_LES_RÉPONSES_À_LA_QUESTION',
		règle,
		valeurs,
	}) as const

/**
 * Modifie la situation et la liste des questions répondues
 * pour plusieurs questions à la fois
 */
export const enregistreLesRéponsesAuxQuestions = (
	situation: Record<DottedName, O.Option<ValeurPublicodes>>
) =>
	({
		type: 'ENREGISTRE_LES_RÉPONSES_AUX_QUESTIONS',
		situation,
	}) as const

export const supprimeLaRègleDeLaSituation = (fieldName: DottedName) =>
	({
		type: 'SUPPRIME_LA_RÈGLE_DE_LA_SITUATION',
		fieldName,
	}) as const

// Navigation dans les questions

export const retourneÀLaQuestionPrécédente = () =>
	({
		type: 'RETOURNE_À_LA_QUESTION_PRÉCÉDENTE',
	}) as const

export const vaÀLaQuestionSuivante = () =>
	({
		type: 'VA_À_LA_QUESTION_SUIVANTE',
	}) as const

export const vaÀLaQuestion = (question: DottedName) =>
	({
		type: 'VA_À_LA_QUESTION',
		question,
	}) as const

// Mise à jour des questions

export const applicabilitéDesQuestionsRépondues = (
	questionsRépondues: Array<QuestionRépondue>
) =>
	({
		type: 'APPLICABILITÉ_DES_QUESTIONS_RÉPONDUES',
		questionsRépondues,
	}) as const

export const metÀJourLesQuestionsSuivantes = (
	questionsSuivantes: Array<DottedName>
) =>
	({
		type: 'MET_À_JOUR_LES_QUESTIONS_SUIVANTES',
		questionsSuivantes,
	}) as const

// Divers

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
	}) as const

export function hideNotification(id: string) {
	return { type: 'HIDE_NOTIFICATION', id } as const
}

// TODO: supprimer car non utilisé ?
export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET',
		name: targetName,
	}) as const
