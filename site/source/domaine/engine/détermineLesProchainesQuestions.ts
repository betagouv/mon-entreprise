import { Order, pipe } from 'effect'
import { filter, map, NonEmptyArray, sort } from 'effect/Array'
import Engine from 'publicodes'

import { ComparateurConfig } from '@/domaine/ComparateurConfig'
import { listeLesVariablesManquantes } from '@/domaine/engine/listeLesVariablesManquantes'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { QuestionRépondue } from '@/store/reducers/simulation.reducer'

export const détermineLesProchainesQuestions = (
	engines: NonEmptyArray<Engine>,
	config: SimulationConfig | ComparateurConfig,
	answeredQuestions: Array<QuestionRépondue> = []
): Array<DottedName> => {
	const {
		liste = [],
		'liste noire': listeNoire = [],
		'non prioritaires': nonPrioritaires = [],
	} = config.questions || {}

	const score = (question: DottedName) => {
		const indexList = liste.indexOf(question)
		const scoreDeListe = (indexList > -1 ? indexList : liste.findIndex((name) => question.startsWith(name))) + 1
		const indexNonPrioritaire =
			nonPrioritaires.findIndex((name) => question.startsWith(name)) + 1
		const différenceCoeff = questionDifference(
			question,
			answeredQuestions.slice(-1)[0]?.règle
		)

		return scoreDeListe + indexNonPrioritaire + différenceCoeff
	}

	return pipe(
		listeLesVariablesManquantes(engines, [
			...(config['objectifs exclusifs'] ?? []),
			...(config.objectifs ?? []),
		]),
		Object.entries,
		sort(([, a], [, b]) => Order.number(b, a)),
		map(([règle]) => règle as DottedName),
		filter(
			(règle: DottedName) =>
				!answeredQuestions.some((question) => question.règle === règle)
		),
		filter(
			(règle: DottedName) =>
				(!liste.length || liste.some((question) => règle.startsWith(question))) &&
				(!listeNoire.length || !listeNoire.some((question) => règle === question)) &&
				(!config['objectifs exclusifs']?.length ||
					!config['objectifs exclusifs'].includes(règle))
		),
		sort((règleA: DottedName, règleB: DottedName) => Order.number(score(règleA), score(règleB))),
		filter(
			(règle: DottedName) =>
				engines[0].getRule(règle).rawNode.question !== undefined
		)
	)
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
