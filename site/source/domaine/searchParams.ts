import * as R from 'effect/Record'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { isExpressionAvecUnité } from '@/domaine/ExpressionPublicodes'
import { isMontant } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { isQuantité } from '@/domaine/Quantité'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { SearchParamsAdapter, ValeurDomaine } from '@/SearchParamsAdapter'

export const TARGET_UNIT_PARAM = 'unité'

const isEncodable = (value: unknown): value is ValeurDomaine =>
	typeof value === 'string' ||
	typeof value === 'number' ||
	isMontant(value) ||
	isQuantité(value)

export const getSearchParamsFromSituation = (
	situation: SituationPublicodes,
	targetUnit: string
) => {
	const searchParams = new URLSearchParams()
	searchParams.set(TARGET_UNIT_PARAM, targetUnit)

	R.map(situation as Record<DottedName, unknown>, (value, dottedName) => {
		if (isEncodable(value)) {
			searchParams.set(dottedName as string, SearchParamsAdapter.encode(value))

			return
		}
		if (isExpressionAvecUnité(value)) {
			searchParams.set(
				dottedName as string,
				SearchParamsAdapter.encode(`${value.valeur} ${value.unité}`)
			)
		}
	})

	searchParams.sort()

	return searchParams
}

export const getSituationFromSearchParams = (
	searchParams: URLSearchParams,
	rules: DottedName[]
): Record<DottedName, ValeurPublicodes> => {
	const situation = {} as Record<DottedName, ValeurPublicodes>

	searchParams.forEach((value, paramName) => {
		const dottedName = paramName as DottedName
		if (rules.includes(dottedName)) {
			situation[dottedName] = SearchParamsAdapter.decode(value)
		}
	})

	return situation
}
