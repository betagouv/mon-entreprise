import {
	collectMissingVariablesByTarget,
	getNextSteps
} from 'Engine/generateQuestions'
import { collectDefaults, rules, rulesFr } from 'Engine/rules'
import { analyseMany, parseAll } from 'Engine/traverse'
import { concat, head, map, path, without } from 'ramda'

export default (flatRules, answerSource) => (state, action) => {
	state.flatRules = flatRules
	// Optimization - don't parse on each analysis
	if (!state.parsedRules) {
		state.parsedRules = parseAll(flatRules)
	}

	if (action.type == 'CHANGE_LANG') {
		if (action.lang == 'fr') {
			flatRules = rulesFr
		} else flatRules = rules
		return {
			...state,
			flatRules
		}
	}

	if (
		![
			'SET_CONVERSATION_TARGETS',
			'STEP_ACTION',
			'USER_INPUT_UPDATE',
			'START_CONVERSATION',
			'SET_ACTIVE_TARGET_INPUT',
			'LOAD_PREVIOUS_SIMULATION'
		].includes(action.type)
	)
		return state

	if (path(['form', 'conversation', 'syncErrors'], state)) return state

	// Most rules have default values
	let rulesDefaults = collectDefaults(flatRules),
		situationWithDefaults = assume(answerSource, rulesDefaults)

	let analysis = analyseMany(state.parsedRules, state.targetNames)(
		situationWithDefaults(state)
	)

	if (action.type === 'USER_INPUT_UPDATE') {
		return {
			...state,
			analysis,
			situationGate: situationWithDefaults(state)
		}
	}
	let nextStepsAnalysis = analyseMany(state.parsedRules, state.targetNames)(
			answerSource(state)
		),
		missingVariablesByTarget = collectMissingVariablesByTarget(
			nextStepsAnalysis.targets
		),
		nextSteps = getNextSteps(missingVariablesByTarget),
		currentQuestion = head(nextSteps)

	let newState = {
		...state,
		analysis,
		situationGate: situationWithDefaults(state),
		explainedVariable: null,
		nextSteps,
		currentQuestion,
		foldedSteps:
			action.type === 'SET_CONVERSATION_TARGETS' && action.reset
				? []
				: state.foldedSteps
	}

	if (
		[
			'SET_ACTIVE_TARGET_INPUT',
			'START_CONVERSATION',
			'LOAD_PREVIOUS_SIMULATION'
		].includes(action.type)
	) {
		// Si rien n'a été renseigné (stillBlank) on renvoie state et pas newState
		// pour éviter que les cases blanches disparaissent, c'est un hack…
		let stillBlank =
			state.activeTargetInput && !answerSource(state)(state.activeTargetInput)

		// Il faut recalculer les missingVariablesByTarget à chaque changement d'objectif
		// car les variables manquantes du salaire de base calculé par inversion dépendent
		// du choix de la variable avec laquelle on fait l'inversion !

		// On reste dépendant d'une coincidence: le fait qu'un input soit renseigné
		// ou non peut donc également changer la donne.
		// Le flux normal est le suivant:
		// - SET_ACTIVE_TARGET_INPUT (clic dans une case blanche)
		// - USER_INPUT_UPDATE (saisie d'une valeur)
		// - START_CONVERSATION (saisie d'une valeur)
		// - SET_ACTIVE_TARGET_INPUT (changement d'objectif)
		// et dans ce cas ça marche, mais supposons qu'on a ensuite:
		// - USER_INPUT_UPDATE (suppression d'une valeur après le début de la conversation)
		// si l'input actif est le salaire de base on a un missingVariables incorrect
		// puisqu'il ne sait pas avec quelle variable on fait l'inversion, et si on fait
		// - SET_ACTIVE_TARGET_INPUT (clic dans une autre case blanche)
		// on va se retrouver avec un affichage incohérent, et il ne sera pas corrigé
		// lors du USER_INPUT_UPDATE puisqu'on ne recalcule pas lors de cette action
		// TODO - corriger ce bug correctement avec des tests auto

		// TODO - utiliser le nom qualifié dans analyseMany et qualifier les targetNames
		let qualifiedTargets = map(
				x => 'contrat salarié . ' + x,
				state.targetNames
			),
			initialAnalysis = analyseMany(state.parsedRules, state.targetNames)(
				name =>
					qualifiedTargets.includes(name) ? answerSource(state)(name) : null
			),
			initialMissingVariablesByTarget = collectMissingVariablesByTarget(
				initialAnalysis.targets
			)

		return {
			...(stillBlank ? state : newState),
			missingVariablesByTarget: {
				initial: initialMissingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}
	}

	if (action.type == 'STEP_ACTION' && action.name == 'fold') {
		let foldedSteps = [...state.foldedSteps, state.currentQuestion]

		return {
			...newState,
			foldedSteps,
			missingVariablesByTarget: {
				...state.missingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}
	}
	if (action.type == 'STEP_ACTION' && action.name == 'unfold') {
		// We are possibly "refolding" a previously open question
		let previous = state.currentQuestion,
			// we fold it back into foldedSteps if it had been answered
			answered = previous && answerSource(state)(previous) != undefined,
			rawFoldedSteps = answered
				? concat(state.foldedSteps, [previous])
				: state.foldedSteps,
			foldedSteps = without([action.step], rawFoldedSteps)

		return {
			...newState,
			foldedSteps,
			currentQuestion: action.step,
			missingVariablesByTarget: {
				...state.missingVariablesByTarget,
				current: missingVariablesByTarget
			}
		}
	}
}

// assume "wraps" a given situation function with one that overrides its values with
// the given assumptions
export let assume = (evaluator, assumptions) => state => name => {
	let userInput = evaluator(state)(name)
	return userInput != null ? userInput : assumptions[name]
}
