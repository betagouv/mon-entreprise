import { pipe } from 'effect'
import { flatMap, NonEmptyArray, reduce } from 'effect/Array'
import Engine, { utils } from 'publicodes'

import { Contexte } from '@/domaine/Contexte'
import { DottedName } from '@/domaine/publicodes/DottedName'

export const evalueDansLeContexte =
	(engine: Engine, contexte: Contexte) => (expression: DottedName) =>
		engine.evaluate({
			valeur: expression,
			contexte,
		})

export type MissingVariables = Partial<Record<DottedName, number>>

export const listeLesVariablesManquantes = (
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

/**
 * Merge objectifs missings that depends on the same input field.
 *
 * For instance, the commune field (API) will fill `commune . nom` `commune . taux versement transport`, `commune . département`, etc.
 */
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
