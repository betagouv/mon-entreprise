import { pipe } from 'effect'
import { headNonEmpty, NonEmptyArray, of } from 'effect/Array'
import { isUndefined } from 'effect/Predicate'
import {
	filter,
	fromEntries,
	isEmptyRecord,
	keys,
	partition,
	size,
	toEntries,
} from 'effect/Record'
import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'

import { SimulationConfig } from '@/domaine/SimulationConfig'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { omit } from '@/utils'

export function updateSituationMulti(
	config: SimulationConfig,
	currentSituation: SituationPublicodes,
	amendement: Record<DottedName, PublicodesExpression | undefined>
): SituationPublicodes {
	const [àAjuster, àEffacer] = partition(amendement, isUndefined) as [
		Record<DottedName, PublicodesExpression>,
		Record<DottedName, undefined>,
	]
	const objectifsExclusifs = config['objectifs exclusifs'] ?? []
	const estUnObjectifExclusif = (règle: DottedName): boolean =>
		objectifsExclusifs.includes(règle)

	const [règlesNormales, règlesExclusives] = partition(
		àAjuster,
		(valeur, règle) => estUnObjectifExclusif(règle)
	)

	const clearedSituation = size(règlesExclusives)
		? filter(
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
		...keys(àEffacer)
	)
}

const keepFirstEntry = <T, K extends string>(
	record: Record<K, T>
): Record<K, T> =>
	isEmptyRecord(record)
		? ({} as Record<K, T>)
		: (pipe(
				toEntries(record) as NonEmptyArray<[K, T]>,
				headNonEmpty,
				of,
				fromEntries
		  ) as Record<K, T>)
