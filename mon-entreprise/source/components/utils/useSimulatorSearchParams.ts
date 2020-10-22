import { useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'Components/utils/useSearchParams'
import { EngineContext } from 'Components/utils/EngineContext'
import {
	configSelector,
	situationSelector,
	targetUnitSelector
} from 'Selectors/simulationSelectors'
import Engine from 'publicodes'

export function useSimulatorSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams()
	const config = useSelector(configSelector)
	const situation = useSelector(situationSelector)
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const queryString = getSearchParamsFromSituation(
		Object.keys(situation).length ? situation : config.situation || situation,
		targetUnit,
		engine
	)
	searchParams.sort()
	const currentQueryString = searchParams.toString()
	const hasConfig = Object.keys(config).length > 0
	useEffect(() => {
		if (hasConfig && currentQueryString !== queryString) {
			setSearchParams(queryString, { replace: true })
		}
	}, [setSearchParams, currentQueryString, queryString, hasConfig])
}

function getSearchParamsFromSituation<T extends string>(
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
	for (const [dottedName, value] of Object.entries(situation)) {
		const paramName = rules[dottedName]?.['identifiant court']
		if (paramName) {
			const parsedValue = engine.evaluate(value, { unit: targetUnit }).nodeValue
			if (parsedValue) {
				if (typeof parsedValue === 'number') {
					searchParams.set(paramName, '' + Math.round(parsedValue))
				} else if (parsedValue === true) {
					searchParams.set(paramName, '')
				} else {
					searchParams.set(paramName, parsedValue)
				}
			}
		}
	}
	searchParams.sort()
	return searchParams.toString()
}
