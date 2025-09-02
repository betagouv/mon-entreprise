import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { Names } from 'modele-social/dist/names'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { useEngine } from '@/components/utils/EngineContext'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { SearchParamsAdapter, ValeurDomaine } from '@/SearchParamsAdapter'
import {
	batchUpdateSituation,
	setActiveTarget,
	updateUnit,
} from '@/store/actions/actions'
import { SituationPublicodes } from '@/store/reducers/rootReducer'
import { configObjectifsSelector } from '@/store/selectors/simulationSelectors'

export const TARGET_UNIT_PARAM = 'unité'

export default function useSearchParamsSimulationSharing() {
	const [searchParams, setSearchParams] = useSearchParams()
	// saves params for development, as strict mode is running twice
	const [initialSearchParams] = useState(new URLSearchParams(searchParams))
	const objectifs = useSelector(configObjectifsSelector)
	const dispatch = useDispatch()
	const engine = useEngine()

	const rules = useMemo(() => R.keys(engine.getParsedRules()), [engine])

	const setNewTargetUnit = useCallback(() => {
		const newTargetUnit = getTargetUnitFromSearchParams(initialSearchParams)
		if (newTargetUnit) {
			dispatch(updateUnit(newTargetUnit))
		}
	}, [dispatch, initialSearchParams])

	const setNewSituation = useCallback(
		(newSituation: Record<DottedName, ValeurDomaine>) => {
			if (!R.isEmptyReadonlyRecord(newSituation)) {
				dispatch(
					batchUpdateSituation(
						pipe(
							newSituation,
							R.map((valeur) => O.fromNullable(valeur))
						)
					)
				)
			}
		},
		[dispatch]
	)

	const setNewActiveTarget = useCallback(
		(newSituation: Record<DottedName, ValeurDomaine>) => {
			const newActiveTarget = pipe(
				R.keys(newSituation),
				A.findFirst((dottedName) =>
					objectifs.includes(dottedName as DottedName)
				)
			)

			if (O.isSome(newActiveTarget)) {
				dispatch(setActiveTarget(newActiveTarget.value))
			}
		},
		[dispatch, objectifs]
	)

	const resetSearchParams = useCallback(() => {
		const newSearchParams = searchParams
		newSearchParams.delete(TARGET_UNIT_PARAM)

		rules.forEach((dottedName) => newSearchParams.delete(dottedName))

		setSearchParams(newSearchParams, { replace: true })
	}, [rules, searchParams, setSearchParams])

	// On load:
	useEffect(() => {
		const newSituation = getSituationFromSearchParams(
			initialSearchParams,
			rules
		)

		setNewTargetUnit()
		setNewSituation(newSituation)
		setNewActiveTarget(newSituation)

		resetSearchParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}

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

const getSituationFromSearchParams = (
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

const getTargetUnitFromSearchParams = (
	searchParams: URLSearchParams
): string | null =>
	searchParams.has(TARGET_UNIT_PARAM)
		? searchParams.get(TARGET_UNIT_PARAM)
		: null
