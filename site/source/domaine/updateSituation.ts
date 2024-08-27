import { pipe } from 'effect'
import { isNumber, isString } from 'effect/Predicate'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'

import { ImmutableType } from '@/types/utils'
import { objectTransform, omit } from '@/utils'

import { SimulationConfig } from './SimulationConfig'
import { Situation } from './Situation'

export function updateSituation(
	config: ImmutableType<SimulationConfig>,
	currentSituation: Situation,
	dottedName: DottedName,
	value: PublicodesExpression | undefined
): Situation {
	if (value === undefined) {
		return omit(currentSituation, dottedName)
	}

	const objectifsExclusifs = config['objectifs exclusifs'] ?? []

	const nouvellesValeurs =
		isString(value) || isNumber(value)
			? { [dottedName]: value }
			: pipe(
					value,
					R.mapKeys((suffixe) => `${dottedName} . ${suffixe}`),
					R.map((valeur) => (isString(valeur) ? `'${valeur}'` : valeur)) // 😭
			  )

	if (!objectifsExclusifs.includes(dottedName)) {
		return { ...currentSituation, ...nouvellesValeurs }
	}

	const objectifsToReset = objectifsExclusifs.filter(
		(name) => name !== dottedName
	)

	const clearedSituation = objectTransform(currentSituation, (entries) =>
		entries.filter(
			([dottedName]) => !objectifsToReset.includes(dottedName as DottedName)
		)
	)

	return { ...clearedSituation, [dottedName]: value }
}
