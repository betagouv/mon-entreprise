import { Order, pipe } from 'effect'
import { filter, map, sort } from 'effect/Array'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

import { ComparateurConfig } from '@/domaine/ComparateurConfig'
import { listeLesVariablesManquantes } from '@/domaine/engine/listeLesVariablesManquantes'
import { SimulationConfig } from '@/domaine/SimulationConfig'

export const détermineLesProchainesQuestions = (
	engine: Engine,
	config: SimulationConfig | ComparateurConfig,
	answeredQuestions: Array<DottedName> = []
): Array<DottedName> => {
	const variablesManquantes = listeLesVariablesManquantes(
		engine,
		config.objectifs || [],
		'contextes' in config ? config.contextes : undefined
	)

	const {
		liste = [],
		'liste noire': listeNoire = [],
		'non prioritaires': nonPrioritaires = [],
	} = config.questions || {}

	const score = (question: string) => {
		const indexList = liste.findIndex((name) => question.startsWith(name)) + 1
		const indexNonPrioritaire =
			nonPrioritaires.findIndex((name) => question.startsWith(name)) + 1
		const différenceCoeff = questionDifference(
			question,
			answeredQuestions.slice(-1)[0]
		)

		return indexList + indexNonPrioritaire + différenceCoeff
	}

	const nextSteps = pipe(
		variablesManquantes,
		Object.entries,
		sort(([, a], [, b]) => Order.number(b, a)),
		map(([name]) => name as DottedName),
		filter((name) => !answeredQuestions.includes(name)),
		filter(
			(step) =>
				(!liste.length || liste.some((name) => step.startsWith(name))) &&
				(!listeNoire.length || !listeNoire.some((name) => step === name))
		),
		sort((a: DottedName, b: DottedName) => Order.number(score(a), score(b))),
		filter(
			(question) => engine.getRule(question).rawNode.question !== undefined
		)
	)

	return nextSteps
}

// Max : 1
// Min -> 0
const questionDifference = (ruleA = '', ruleB = '') => {
	if (ruleA === ruleB) {
		return 0
	}
	const partsA = ruleA.split(' . ')
	const partsB = ruleB.split(' . ')

	return 1 / (1 + partsA.findIndex((val, i) => partsB?.[i] !== val))
}
