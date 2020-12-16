import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SimulationConfig, Situation } from 'Reducers/rootReducer'
import { useSearchParams } from 'Components/utils/useSearchParams'
import { useEngine } from 'Components/utils/EngineContext'
import {
	configSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { ParsedRules } from 'publicodes'
import { DottedName } from 'modele-social'
import { updateSituation, setActiveTarget } from 'Actions/actions'

type Objectifs = (string | { objectifs: string[] })[]
type ShortName = string
type ParamName = DottedName | ShortName

export default function useSearchParamsSimulationSharing() {
	const [urlSituationIsExtracted, setUrlSituationIsExtracted] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const config = useSelector(configSelector)
	const situation = useSelector(situationSelector)
	const engine = useEngine()
	const dispatch = useDispatch()

	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getRules()),
		[engine]
	)

	useEffect(() => {
		const hasConfig = Object.keys(config).length > 0
		if (!hasConfig) return

		// On load:
		if (!urlSituationIsExtracted) {
			const objectifs = objectifsOfConfig(config)
			const newSituation = getSituationFromSearchParams(
				searchParams,
				dottedNameParamName
			)

			Object.entries(newSituation).forEach(([dottedName, value]) => {
				dispatch(updateSituation(dottedName as DottedName, value))
			})
			const newActiveTarget = Object.keys(newSituation).filter((dottedName) =>
				objectifs.includes(dottedName)
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

			setUrlSituationIsExtracted(true)
			return
		}
	}, [
		dispatch,
		dottedNameParamName,
		config,
		searchParams,
		setSearchParams,
		situation,
		urlSituationIsExtracted,
	])

	return () => getSearchParamsFromSituation(situation, dottedNameParamName)
}

const objectifsOfConfig = (config: Partial<SimulationConfig>) =>
	(config.objectifs as Objectifs).flatMap((objectifOrSection) => {
		if (typeof objectifOrSection === 'string') {
			return [objectifOrSection]
		}
		return objectifOrSection.objectifs
	})

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
	setSearchParams(searchParams.toString())
}

export const getRulesParamNames = (
	parsedRules: ParsedRules<DottedName>
): [DottedName, ParamName][] =>
	(Object.entries(parsedRules) as [
		DottedName,
		{ rawNode: { 'identifiant court'?: ShortName } }
	][]).map(([dottedName, ruleNode]) => [
		dottedName,
		ruleNode.rawNode['identifiant court'] || dottedName,
	])

// Simple (de)serialization based on value type
export const serialize = (
	value: Record<string, unknown> | string | number
): string => {
	switch (typeof value) {
		case 'object':
			return `${JSON.stringify(value)}`
		case 'string':
			return value
		case 'number':
			return `_${value}`
		default:
			throw new Error('Unexpected type in situation')
	}
}
export const deserialize = (
	value: string
): Record<string, unknown> | string | number | undefined => {
	if (value.startsWith('_')) {
		try {
			return parseFloat(value.slice(1))
		} catch {
			return
		}
	}
	if (value.startsWith('{')) {
		try {
			return JSON.parse(value)
		} catch {
			return
		}
	}
	return value
}

export function getSearchParamsFromSituation(
	situation: Situation,
	dottedNameParamName: [DottedName, ParamName][]
): URLSearchParams {
	const searchParams = new URLSearchParams()
	const dottedNameParamNameMapping = Object.fromEntries(dottedNameParamName)
	;(Object.entries(situation) as [DottedName, any][]).forEach(
		([dottedName, value]) => {
			const paramName = dottedNameParamNameMapping[dottedName]
			try {
				searchParams.set(paramName, serialize(value))
			} catch {
				// noop
			}
		}
	)
	searchParams.sort()
	return searchParams
}

export function getSituationFromSearchParams(
	searchParams: URLSearchParams,
	dottedNameParamName: [DottedName, ParamName][]
) {
	const situation = {} as Situation

	const paramNameDottedName = dottedNameParamName.reduce(
		(dottedNameBySearchParamName, [dottedName, paramName]) => ({
			...dottedNameBySearchParamName,
			[paramName]: dottedName,
		}),
		{} as Record<ParamName, DottedName>
	)

	searchParams.forEach((value, paramName) => {
		if (Object.prototype.hasOwnProperty.call(paramNameDottedName, paramName)) {
			situation[paramNameDottedName[paramName]] = deserialize(value)
		}
	})

	return situation
}
