import { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'Components/utils/useSearchParams'
import { EngineContext } from 'Components/utils/EngineContext'
import {
	configSelector,
	situationSelector,
	targetUnitSelector
} from 'Selectors/simulationSelectors'
import { SimulationConfig } from 'reducers/rootReducer'
import Engine from 'publicodes'
import { DottedName } from 'Rules'
import { updateSituation, updateUnit, setActiveTarget } from 'Actions/actions'

type Objectifs = (string | { objectifs: string[] })[]

export default function useSyncSituationInUrl() {
	const [configIsExtracted, setConfigIsExtracted] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const config = useSelector(configSelector)
	const situation = useSelector(situationSelector)
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const dispatch = useDispatch()

	useEffect(() => {
		const hasConfig = Object.keys(config).length > 0

		if (configIsExtracted) {
			const queryString = getSearchParamsFromSituation(
				Object.keys(situation).length
					? situation
					: config.situation || situation,
				targetUnit || (config['unité par défaut'] as string),
				engine
			)
			searchParams.sort()
			if (hasConfig && searchParams.toString() !== queryString) {
				setSearchParams(queryString, { replace: true })
			}
		} else if (hasConfig) {
			const configFromURL = getSituationFromSearchParams(
				searchParams,
				config,
				engine
			)
			if (configFromURL) {
				dispatch(updateUnit(configFromURL.targetUnit))
				Object.entries(configFromURL.situation).forEach(
					([dottedName, value]) => {
						dispatch(updateSituation(dottedName as DottedName, value))
					}
				)
				const activeTarget = Object.keys(configFromURL.situation)[0]
				if (activeTarget) {
					dispatch(setActiveTarget(activeTarget as DottedName))
				}
				setConfigIsExtracted(true)
			}
		}
	}, [
		config,
		configIsExtracted,
		situation,
		targetUnit,
		engine,
		searchParams,
		setSearchParams,
		dispatch
	])
}

export function getSearchParamsFromSituation<T extends string>(
	situation: Record<string, string>,
	targetUnit: string,
	engine: Engine<T>
) {
	const rules = engine.getParsedRules()
	const searchParams = new URLSearchParams()
	if (targetUnit === '€/an') {
		searchParams.set('periode', 'an')
	} else {
		searchParams.delete('periode')
	}
	Object.entries(situation).forEach(([dottedName, value]) => {
		const paramName = rules[dottedName]?.['identifiant court']
		if (paramName) {
			const parsedValue = engine.evaluate(value, { unit: targetUnit }).nodeValue
			if (parsedValue) {
				if (typeof parsedValue === 'number') {
					searchParams.set(
						paramName,
						'' + Math.round((parsedValue + Number.EPSILON) * 100) / 100
					)
				} else if (parsedValue === true) {
					searchParams.set(paramName, '')
				} else {
					searchParams.set(paramName, parsedValue)
				}
			}
		}
	})
	searchParams.sort()
	return searchParams.toString()
}

export function getSituationFromSearchParams<T extends string>(
	searchParams: URLSearchParams,
	config: Partial<SimulationConfig>,
	engine: Engine<T>
) {
	const rules = engine.getParsedRules()
	const targetUnit = searchParams.get('periode') ? '€/an' : '€/mois'
	const situation = {} as Record<DottedName, string | boolean>

	const objectifs = (config.objectifs as Objectifs).flatMap(
		objectifOrSection => {
			if (typeof objectifOrSection === 'string') {
				return [objectifOrSection]
			}
			return objectifOrSection.objectifs
		}
	)
	const ruleBySearchParamName = (Object.entries(rules) as [
		string,
		{ 'identifiant court'?: string }
	][])
		.filter(
			([dottedName, rule]) =>
				objectifs.includes(dottedName) && rule['identifiant court']
		)
		.map(([dottedName, rule]) => [
			dottedName,
			rule['identifiant court'] as string
		])
		.reduce(
			(ruleBySearchParamName, [dottedName, paramName]) => ({
				...ruleBySearchParamName,
				[paramName]: dottedName
			}),
			{}
		)

	searchParams.forEach((value, paramName) => {
		const dottedName = ruleBySearchParamName[paramName]
		if (dottedName) {
			situation[dottedName] = value ? `${value} ${targetUnit}` : true
		}
	})

	return {
		targetUnit,
		situation
	}
}
