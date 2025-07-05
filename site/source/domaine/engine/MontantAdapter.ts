import { pipe } from 'effect'
import * as O from 'effect/Option'
import { EvaluatedNode, PublicodesExpression, serializeUnit } from 'publicodes'

import {
	euros,
	eurosParAn,
	eurosParMois,
	Montant,
} from '@/domaine/Montant'

type UnitéDeMontantPublicodes = '€/mois' | '€/an' | '€'

export const MontantAdapter = {
	decode: (node: EvaluatedNode): O.Option<Montant> => {
		if (
			node.nodeValue === null ||
			node.nodeValue === undefined ||
			typeof node.nodeValue === 'boolean'
		) {
			return O.none()
		}

		const numberValue =
			typeof node.nodeValue === 'string'
				? parseFloat(node.nodeValue)
				: node.nodeValue

		if (isNaN(numberValue)) return O.none()

		if (!node.unit) return O.some(euros(numberValue))

		const formattedUnit = serializeUnit(node.unit)

		switch (formattedUnit) {
			case '€':
				return O.some(euros(numberValue))
			case '€/an':
				return O.some(eurosParAn(numberValue))
			case '€/mois':
				return O.some(eurosParMois(numberValue))
			default:
				console.warn(
					`Le montant ${numberValue} est en ${formattedUnit}, ce n’est pas pris en charge.`
				)

				return O.none()
		}
	},
	encode: (valeur: O.Option<Montant>) =>
		pipe(
			valeur,
			O.map((m) => `${m.valeur} ${m.unité}`),
			O.getOrUndefined
		) satisfies PublicodesExpression | undefined,
}

export const estUneUnitéDeMontantPublicodes = (
	unité?: string
): unité is UnitéDeMontantPublicodes =>
	unité === '€/mois' || unité === '€/an' || unité === '€'
