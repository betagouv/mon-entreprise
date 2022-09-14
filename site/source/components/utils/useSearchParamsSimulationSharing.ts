import { batchUpdateSituation, setActiveTarget } from '@/actions/actions'
import { useEngine } from '@/components/utils/EngineContext'
import { RootState, SimulationConfig, Situation } from '@/reducers/rootReducer'
import { configSelector } from '@/selectors/simulationSelectors'
import { DottedName } from 'modele-social'
import Engine, { ParsedRules, serializeEvaluation } from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useSearchParams } from 'react-router-dom'

type Objectifs = (string | { objectifs: string[] })[]
type ShortName = string
type ParamName = DottedName | ShortName

export default function useSearchParamsSimulationSharing() {
	const [urlSituationIsExtracted, setUrlSituationIsExtracted] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const config = useSelector(configSelector)
	const simulationUrl = useSelector((state: RootState) => state.simulation?.url)
	const currentUrl = useLocation().pathname
	const dispatch = useDispatch()
	const engine = useEngine()

	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)

	useEffect(() => {
		// const hasConfig = Object.keys(config).length > 0

		// // TODO: this check is specific to `useSimulationConfig` and
		// // `setSimulationConfig`, so we'd prefer not doing it here. Other ideas
		// // include having the config in a provider rather than in state.
		// const configLoadedInState = simulationUrl === currentUrl
		// if (!hasConfig || !configLoadedInState) return

		// On load:
		if (!urlSituationIsExtracted) {
			const objectifs = objectifsOfConfig(config)
			const newSituation = getSituationFromSearchParams(
				searchParams,
				dottedNameParamName
			)
			if (Object.keys(newSituation).length > 0) {
				dispatch(batchUpdateSituation(newSituation as Situation))
			}

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
		}
	}, [
		currentUrl,
		simulationUrl,
		dispatch,
		dottedNameParamName,
		config,
		searchParams,
		setSearchParams,
		urlSituationIsExtracted,
	])

	// Cleanup:
	useEffect(() => {
		return () => {
			setUrlSituationIsExtracted(false)
		}
	}, [])
}

export const useParamsFromSituation = (situation: Situation) => {
	const engine = useEngine()
	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)

	return getSearchParamsFromSituation(engine, situation, dottedNameParamName)
}

const objectifsOfConfig = (config: Partial<SimulationConfig>) =>
	(config.objectifs ?? ([] as Objectifs)).flatMap((objectifOrSection) => {
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
	setSearchParams(searchParams.toString(), { replace: true })
}

export const getRulesParamNames = (
	parsedRules: ParsedRules<DottedName>
): [DottedName, ParamName][] =>
	(
		Object.entries(parsedRules) as [
			DottedName,
			{ rawNode: { 'identifiant court'?: ShortName } }
		][]
	).map(([dottedName, ruleNode]) => [
		dottedName,
		ruleNode.rawNode['identifiant court'] || dottedName,
	])

export function getSearchParamsFromSituation(
	engine: Engine,
	situation: Situation,
	dottedNameParamName: [DottedName, ParamName][]
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
	searchParams.sort()

	return searchParams
}

export function getSituationFromSearchParams(
	searchParams: URLSearchParams,
	dottedNameParamName: [DottedName, ParamName][]
) {
	const situation: { [key in DottedName]?: string | Record<string, unknown> } =
		{}

	const paramNameDottedName = dottedNameParamName.reduce(
		(dottedNameBySearchParamName, [dottedName, paramName]) => ({
			...dottedNameBySearchParamName,
			[paramName]: dottedName,
		}),
		{} as Record<ParamName, DottedName>
	)

	searchParams.forEach((value, paramName) => {
		if (Object.prototype.hasOwnProperty.call(paramNameDottedName, paramName)) {
			situation[paramNameDottedName[paramName]] = value

			if (value.startsWith('{') && value.endsWith('}')) {
				try {
					const parsed = JSON.parse(value) as Record<string, unknown>

					situation[paramNameDottedName[paramName]] = parsed
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(error)
				}
			}
		}
	})

	return situation
}
