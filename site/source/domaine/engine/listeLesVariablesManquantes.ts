import { pipe } from 'effect'
import { flatMap, NonEmptyReadonlyArray, reduce } from 'effect/Array'
import { DottedName } from 'modele-social'
import Engine, { utils } from 'publicodes'

import { Contexte } from '@/domaine/Contexte'
import { Situation } from '@/domaine/Situation'

export const evalueDansLeContexte =
	(engine: Engine, contexte: Contexte) => (expression: DottedName) =>
		engine.evaluate({
			value: expression,
			contexte,
		})

export type MissingVariables = Partial<Record<DottedName, number>> | undefined

export const listeLesVariablesManquantes = (
	engine: Engine,
	objectifs: ReadonlyArray<DottedName>,
	contextes?: NonEmptyReadonlyArray<Situation> | undefined
) => {
	console.log('engine', engine)

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
