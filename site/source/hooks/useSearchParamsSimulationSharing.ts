import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { DottedName } from 'modele-social'
import Engine, { ParsedRules, serializeEvaluation } from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { useEngine } from '@/components/utils/EngineContext'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { SearchParamsAdapter } from '@/SearchParamsAdapter'
import {
	batchUpdateSituation,
	setActiveTarget,
	updateUnit,
} from '@/store/actions/actions'
import { SituationPublicodes } from '@/store/reducers/rootReducer'
import { configObjectifsSelector } from '@/store/selectors/simulationSelectors'

type ShortName = string
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type ParamName = DottedName | ShortName

export const TARGET_UNIT_PARAM = 'unite'

export default function useSearchParamsSimulationSharing() {
	const [searchParams, setSearchParams] = useSearchParams()
	// saves params for development, as strict mode is running twice
	const [initialSearchParams] = useState(new URLSearchParams(searchParams))
	const objectifs = useSelector(configObjectifsSelector)
	const dispatch = useDispatch()
	const engine = useEngine()

	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)

	useEffect(() => {
		// On load:
		const newTargetUnit = getTargetUnitFromSearchParams(initialSearchParams)
		if (newTargetUnit) {
			dispatch(updateUnit(newTargetUnit))
		}

		const newSituation = getSituationFromSearchParams(
			initialSearchParams,
			dottedNameParamName
		)
		if (Object.keys(newSituation).length > 0) {
			dispatch(
				batchUpdateSituation(
					pipe(
						newSituation,
						R.map((valeur) => O.fromNullable(valeur))
					)
				)
			)
		}

		const newActiveTarget = Object.keys(newSituation).filter((dottedName) =>
			objectifs.includes(dottedName as DottedName)
		)[0]
		if (newActiveTarget) {
			dispatch(setActiveTarget(newActiveTarget as DottedName))
		}

		cleanSearchParams(
			searchParams,
			setSearchParams,
			dottedNameParamName,
			Object.keys(newSituation) as DottedName[]
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}

export const useParamsFromSituation = (
	situation: SituationPublicodes,
	targetUnit: string
) => {
	const engine = useEngine()
	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)

	return getSearchParams(engine, situation, dottedNameParamName, targetUnit)
}

export const cleanSearchParams = (
	searchParams: ReturnType<typeof useSearchParams>[0],
	setSearchParams: ReturnType<typeof useSearchParams>[1],
	dottedNameParamName: [DottedName, ParamName][],
	dottedNames: DottedName[]
) => {
	const dottedNameParamNameMapping = Object.fromEntries(dottedNameParamName)
	dottedNames.forEach((dottedName) =>
		searchParams.delete(dottedNameParamNameMapping[dottedName])
	)
	searchParams.delete(TARGET_UNIT_PARAM)
	setSearchParams(searchParams.toString(), { replace: true })
}

export const getRulesParamNames = (
	parsedRules: ParsedRules<DottedName>
): [DottedName, ParamName][] =>
	(
		Object.entries(parsedRules) as [
			DottedName,
			{ rawNode: { 'identifiant court'?: ShortName } },
		][]
	).map(([dottedName, ruleNode]) => [
		dottedName,
		ruleNode.rawNode['identifiant court'] || dottedName,
	])

export function getSearchParams(
	engine: Engine,
	situation: SituationPublicodes,
	dottedNameParamName: [DottedName, ParamName][],
	targetUnit: string
): URLSearchParams {
	const searchParams = new URLSearchParams()
	const dottedNameParamNameMapping = Object.fromEntries(dottedNameParamName)

	Object.entries(situation).forEach(([dottedName, value]) => {
		const paramName = dottedNameParamNameMapping[dottedName]
		try {
			const serializedValue = serializeEvaluation(engine.evaluate(value))

			if (typeof serializedValue !== 'undefined') {
				searchParams.set(paramName, serializedValue)
			} else if (typeof value === 'object') {
				searchParams.set(paramName, JSON.stringify(value))
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		}
	})

	searchParams.set(TARGET_UNIT_PARAM, targetUnit)

	searchParams.sort()

	return searchParams
}

export function getSituationFromSearchParams(
	searchParams: URLSearchParams,
	dottedNameParamName: [DottedName, ParamName][]
): Record<DottedName, ValeurPublicodes> {
	const situation = {} as Record<DottedName, ValeurPublicodes>

	const paramNameDottedName = dottedNameParamName.reduce(
		(dottedNameBySearchParamName, [dottedName, paramName]) => ({
			...dottedNameBySearchParamName,
			[paramName]: dottedName,
		}),
		{} as Record<ParamName, DottedName>
	)

	searchParams.forEach((value, paramName) => {
		if (Object.prototype.hasOwnProperty.call(paramNameDottedName, paramName)) {
			const dottedName = paramNameDottedName[paramName]
			situation[dottedName] = SearchParamsAdapter.decode(
				value
			) as ValeurPublicodes
		}
	})

	return situation
}

export function getTargetUnitFromSearchParams(
	searchParams: URLSearchParams
): string | null {
	if (searchParams.has(TARGET_UNIT_PARAM)) {
		return searchParams.get(TARGET_UNIT_PARAM)
	}

	return null
}
