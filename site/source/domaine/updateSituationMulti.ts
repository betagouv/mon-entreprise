import { pipe } from 'effect'
import { headNonEmpty, NonEmptyArray, of } from 'effect/Array'
import * as O from 'effect/Option'
import { isUndefined } from 'effect/Predicate'
import * as R from 'effect/Record'
import { PublicodesExpression } from 'publicodes'

import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { omit } from '@/utils'

export function updateSituationMulti(
	config: SimulationConfig,
	currentSituation: SituationPublicodes,
	amendement: Record<DottedName, ValeurPublicodes | undefined>
): SituationPublicodes {
	const [àAjuster, àEffacer] = R.partition(amendement, isUndefined) as [
		Record<DottedName, ValeurPublicodes>,
		Record<DottedName, undefined>,
	]
	const objectifsExclusifs = config['objectifs exclusifs'] ?? []
	const estUnObjectifExclusif = (règle: DottedName): boolean =>
		objectifsExclusifs.includes(règle)

	const [règlesNormales, règlesExclusives] = pipe(
		àAjuster,
		R.map((valeur) => PublicodesAdapter.encode(O.fromNullable(valeur))),
		R.partition((_valeur, règle) => estUnObjectifExclusif(règle))
	)

	const clearedSituation = R.size(règlesExclusives)
		? R.filter(
				currentSituation as Record<DottedName, PublicodesExpression>,
				(_, règle) => !estUnObjectifExclusif(règle) || règle in règlesExclusives
		  )
		: currentSituation

	return omit(
		{
			...clearedSituation,
			...keepFirstEntry(règlesExclusives),
			...règlesNormales,
		},
		...R.keys(àEffacer)
	)
}

const keepFirstEntry = <T, K extends string>(
	record: Record<K, T>
): Record<K, T> =>
	R.isEmptyRecord(record)
		? ({} as Record<K, T>)
		: (pipe(
				R.toEntries(record) as NonEmptyArray<[K, T]>,
				headNonEmpty,
				of,
				R.fromEntries
		  ) as Record<K, T>)
