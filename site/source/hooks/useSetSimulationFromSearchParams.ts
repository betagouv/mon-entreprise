import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import {
	getRèglesIgnoréesFromSearchParams,
	getSituationFromSearchParams,
	getTargetUnitFromSearchParams,
	TARGET_UNIT_PARAM,
} from '@/domaine/searchParams'
import { useNavigation } from '@/lib/navigation'
import { ValeurDomaine } from '@/SearchParamsAdapter'
import {
	enregistreLesRéponsesAuxQuestions,
	setActiveTarget,
	updateUnit,
} from '@/store/actions/actions'
import { configObjectifsSelector } from '@/store/selectors/simulation/config/configObjectifs.selector'
import { simulationChargéeDepuisLien } from '@/store/slices/simulationSource.slice'

import { useEngineFromModèle } from './useEngineFromModèle'

export default function useSetSimulationFromSearchParams(nomModèle: NomModèle) {
	const { searchParams, searchParamsKnown, setSearchParams } = useNavigation()
	const queryString = searchParams.toString()
	const alreadyApplied = useRef(false)
	const objectifs = useSelector(configObjectifsSelector)
	const dispatch = useDispatch()

	const engine = useEngineFromModèle(nomModèle)
	const rules = useMemo(() => R.keys(engine.getParsedRules()), [engine])

	const setNewTargetUnit = useCallback(
		(searchParamsLus: URLSearchParams) => {
			const newTargetUnit = getTargetUnitFromSearchParams(searchParamsLus)
			if (newTargetUnit) {
				dispatch(updateUnit(newTargetUnit))
			}
		},
		[dispatch]
	)

	const setNewSituation = useCallback(
		(newSituation: Record<DottedName, ValeurDomaine>) => {
			if (!R.isEmptyReadonlyRecord(newSituation)) {
				dispatch(
					enregistreLesRéponsesAuxQuestions(
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
				A.findFirst((dottedName) => objectifs.includes(dottedName))
			)

			if (O.isSome(newActiveTarget)) {
				dispatch(setActiveTarget(newActiveTarget.value))
			}
		},
		[dispatch, objectifs]
	)

	const resetSearchParams = useCallback(
		(searchParamsLus: URLSearchParams) => {
			const newSearchParams = new URLSearchParams(searchParamsLus)
			newSearchParams.delete(TARGET_UNIT_PARAM)

			rules.forEach((dottedName) => newSearchParams.delete(dottedName))

			setSearchParams(newSearchParams, { replace: true })
		},
		[rules, setSearchParams]
	)

	useEffect(() => {
		if (!searchParamsKnown || alreadyApplied.current) {
			return
		}
		alreadyApplied.current = true

		const searchParamsLus = new URLSearchParams(queryString)
		const newSituation = getSituationFromSearchParams(searchParamsLus, rules)

		setNewTargetUnit(searchParamsLus)
		setNewSituation(newSituation)
		setNewActiveTarget(newSituation)

		const règlesIgnorées = getRèglesIgnoréesFromSearchParams(
			searchParamsLus,
			rules
		)

		if (!R.isEmptyReadonlyRecord(newSituation) || règlesIgnorées.length > 0) {
			dispatch(simulationChargéeDepuisLien(règlesIgnorées))
		}

		resetSearchParams(searchParamsLus)
	}, [
		searchParamsKnown,
		queryString,
		rules,
		setNewTargetUnit,
		setNewSituation,
		setNewActiveTarget,
		dispatch,
		resetSearchParams,
	])
}
