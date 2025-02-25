import { configComparateurStatuts } from "@/pages/simulateurs/comparaison-statuts/simulationConfig";
import { QuestionRépondue } from "@/store/reducers/simulation.reducer";
import { Order, pipe } from "effect";
import { filter, flatMap, map, NonEmptyArray, NonEmptyReadonlyArray, reduce, sort } from "effect/Array";
import rules, { DottedName } from "modele-social";
import Engine, { utils } from "publicodes";
import { describe, expect, it } from "vitest";
import { Situation } from "../Situation";
import { evalueDansLeContexte, MissingVariables } from "./listeLesVariablesManquantes";


describe('détermineLesProchainesQuestions', () => {
	const engine = new Engine(rules)
	const config = configComparateurStatuts
	const answeredQuestions: Array<QuestionRépondue> = []
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
			answeredQuestions.slice(-1)[0]?.règle
		)

		return indexList + indexNonPrioritaire + différenceCoeff
	}

	it('avec 3 engines', () => {
		const engines = config.contextes.map(() =>
			engine.shallowCopy()
		) as NonEmptyArray<Engine>
		
		const situationsAvecContextes = config.contextes.map((contexte) => ({
			...config.situation,
			...contexte,
		}))
		
		engines.forEach((engine, index) => {
			engine.setSituation(situationsAvecContextes[index])
		})

		const listeLesVariablesManquantes = (
			engines: NonEmptyArray<Engine>,
			objectifs: ReadonlyArray<DottedName>
		): MissingVariables => {
			return pipe(
				engines,
				flatMap((engine) =>
					objectifs.map(
						(objectif) => engine.evaluate(objectif).missingVariables ?? {}
					)
				),
				reduce({}, mergeMissing),
				treatAPIMissingVariables(engines)
			)
		}

		const treatAPIMissingVariables =
			<Name extends string>(engines: Array<Engine<Name>>) =>
			(
				missingVariables: Partial<Record<Name, number>>
			): Partial<Record<Name, number>> =>
				(Object.entries(missingVariables) as Array<[Name, number]>).reduce(
					(missings, [name, value]: [Name, number]) => {
						const parentName = utils.ruleParent(name) as Name
						if (parentName && engines.some(engineHasRule(parentName))) {
							missings[parentName] = (missings[parentName] ?? 0) + value

							return missings
						}
						missings[name] = value

						return missings
					},
					{} as Partial<Record<Name, number>>
				)
		const engineHasRule =
			<Name extends string>(rule: Name) =>
			(engine: Engine<Name>) =>
				engine.getRule(rule).rawNode.API

		const prochainesQuestions = pipe(
				listeLesVariablesManquantes(engines, [
					...(config['objectifs exclusifs'] ?? []),
					...(config.objectifs ?? []),
				]),
				Object.entries,
				sort(([, a], [, b]) => Order.number(b, a)),
				map(([name]) => name as DottedName),
				filter(
					(name: DottedName) =>
						!answeredQuestions.some((question) => question.règle === name)
				),
				filter(
					(step) =>
						(!liste.length || liste.some((name) => step.startsWith(name))) &&
						(!listeNoire.length || !listeNoire.some((name) => step === name)) &&
						(!config['objectifs exclusifs']?.length ||
							!config['objectifs exclusifs'].includes(step))
				),
				sort((a: DottedName, b: DottedName) => Order.number(score(a), score(b))),
				filter(
					(question: DottedName) =>
						engines[0].getRule(question).rawNode.question !== undefined
				)
			)

		expect(prochainesQuestions.length).toEqual(7)
	})

	it('avec un seul engine et 3 contextes', () => {
		const listeLesVariablesManquantes = (
			engine: Engine,
			objectifs: ReadonlyArray<DottedName>,
			contextes?: NonEmptyReadonlyArray<Situation> | undefined
		): MissingVariables => {
			return pipe(
				objectifs,
				flatMap((objectif) =>
					contextes
						? contextes.map(
								(contexte) =>
									evalueDansLeContexte(engine, contexte)(objectif)
										.missingVariables ?? {}
							)
						: [engine.evaluate(objectif).missingVariables ?? {}]
				),
				reduce({}, mergeMissing),
				treatAPIMissingVariables(engine)
			)
		}

		const treatAPIMissingVariables =
			<Name extends string>(engine: Engine<Name>) =>
			(
				missingVariables: Partial<Record<Name, number>>
			): Partial<Record<Name, number>> =>
				(Object.entries(missingVariables) as Array<[Name, number]>).reduce(
					(missings, [name, value]: [Name, number]) => {
						const parentName = utils.ruleParent(name) as Name
						if (parentName && engine.getRule(parentName).rawNode.API) {
							missings[parentName] = (missings[parentName] ?? 0) + value

							return missings
						}
						missings[name] = value

						return missings
					},
					{} as Partial<Record<Name, number>>
				)

		const prochainesQuestions = pipe(
			listeLesVariablesManquantes(
				engine,
				[...(config['objectifs exclusifs'] ?? []), ...(config.objectifs ?? [])],
				'contextes' in config ? config.contextes : undefined
			),
			Object.entries,
			sort(([, a], [, b]) => Order.number(b, a)),
			map(([name]) => name as DottedName),
			filter(
				(name: DottedName) =>
					!answeredQuestions.some((question) => question.règle === name)
			),
			filter(
				(step: DottedName) =>
					(!liste.length || liste.some((name) => step.startsWith(name))) &&
					(!listeNoire.length || !listeNoire.some((name) => step === name)) &&
					(!config['objectifs exclusifs']?.length ||
						!config['objectifs exclusifs'].includes(step))
			),
			sort((a: DottedName, b: DottedName) => Order.number(score(a), score(b))),
			filter(
				(question: DottedName) =>
					engine.getRule(question).rawNode.question !== undefined
			)
		)

		expect(prochainesQuestions.length).toEqual(7)
	})
})

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

const mergeMissing = (
	left: Record<string, number> | undefined = {},
	right: Record<string, number> | undefined = {}
): Record<string, number> =>
	Object.fromEntries(
		[...Object.keys(left), ...Object.keys(right)].map((key) => [
			key,
			(left[key] ?? 0) + (right[key] ?? 0),
		])
	)