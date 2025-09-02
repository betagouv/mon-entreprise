import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { Names } from 'modele-social/dist/names'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { SituationPublicodes } from '@/domaine/SituationPublicodes'
import { SearchParamsAdapter, ValeurDomaine } from '@/SearchParamsAdapter'

export const TARGET_UNIT_PARAM = 'unité'

export const getSearchParamsFromSituation = (
	situation: SituationPublicodes,
	targetUnit: string
) => {
	const searchParams = new URLSearchParams()
	searchParams.set(TARGET_UNIT_PARAM, targetUnit)

	R.map(situation as Record<Names, ValeurDomaine>, (value, dottedName) => {
		try {
			const encodedValue = SearchParamsAdapter.encode(value)
			searchParams.set(dottedName as string, encodedValue)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		}
	})

	searchParams.sort()

	return searchParams
}

export const getSituationFromSearchParams = (
	searchParams: URLSearchParams,
	rules: Names[]
): Record<DottedName, ValeurPublicodes> => {
	const situation = {} as Record<DottedName, ValeurPublicodes>

	searchParams.forEach((value, paramName) => {
		const dottedName = paramName as Names
		if (rules.includes(dottedName)) {
			situation[dottedName] = SearchParamsAdapter.decode(value)
		}
	})

	return situation
}

export const getTargetUnitFromSearchParams = (
	searchParams: URLSearchParams
): string | null =>
	searchParams.has(TARGET_UNIT_PARAM)
		? searchParams.get(TARGET_UNIT_PARAM)
		: null
