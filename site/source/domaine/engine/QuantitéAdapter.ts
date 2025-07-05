import { pipe } from 'effect'
import { join, map } from 'effect/Array'
import * as O from 'effect/Option'
import { split } from 'effect/String'
import { EvaluatedNode, serializeUnit } from 'publicodes'

import { quantité, Quantité } from '@/domaine/Quantité'

const UNITÉS_QUANTITÉ = [
	'%',
	'heures/mois',
	'heures/semaine',
	'jours',
	'jours ouvrés',
	'mois',
	'trimestre civil',
	'année civile',
	'employés',
]

type UnitéDeQuantitéPublicodes = (typeof UNITÉS_QUANTITÉ)[number]

export const QuantitéAdapter = {
	decode: (node: EvaluatedNode): O.Option<Quantité> => {
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

		const formattedUnit =
			node.unit && serializeUnit(node.unit, 2, unitFormatter)

		if (!formattedUnit) {
			return O.none()
		}

		return O.some(quantité(numberValue, formattedUnit))
	},
}

export const estUneUnitéDeQuantitéPublicodes = (
	unité?: string
): unité is UnitéDeQuantitéPublicodes =>
	UNITÉS_QUANTITÉ.includes(unité as UnitéDeQuantitéPublicodes)

const unitFormatter = (unit: string, count: number): string => {
	const unitToPluralize = [
		'heure',
		'jour',
		'jour ouvré',
		'trimestre civil',
		'année civile',
		'employé',
	]
	if (unitToPluralize.includes(unit) && count > 1) {
		return pipe(
			unit,
			split(' '),
			map((word) => `${word}s`),
			join(' ')
		)
	}

	return unit
}
