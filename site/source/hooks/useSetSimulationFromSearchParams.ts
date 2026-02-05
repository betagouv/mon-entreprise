import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { useSearchParams } from '@/lib/navigation'
import {
	getSituationFromSearchParams,
	getTargetUnitFromSearchParams,
	TARGET_UNIT_PARAM,
} from '@/domaine/searchParams'
import { ValeurDomaine } from '@/SearchParamsAdapter'
import {
	batchUpdateSituation,
	setActiveTarget,
	updateUnit,
} from '@/store/actions/actions'
import { configObjectifsSelector } from '@/store/selectors/simulationSelectors'

export default function useSetSimulationFromSearchParams() {
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
