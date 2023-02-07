import exonerationCovid, {
	DottedName as ExoCovidDottedNames,
} from 'exoneration-covid'
import Engine from 'publicodes'
import { useContext, useRef } from 'react'

import { EngineContext, EngineProvider } from '@/components/utils/EngineContext'
import { useSituationState } from '@/components/utils/SituationContext'

import { ExonérationCovid } from './ExonérationCovid'

const exoCovidEngine = new Engine(exonerationCovid)

export const useExoCovidEngine = () =>
	useContext(EngineContext) as Engine<ExoCovidDottedNames>

export const useExoCovidSituationState = () =>
	useSituationState<ExoCovidDottedNames>()

/**
 * Use this hooks to keep state of engine with the react fast refresh
 * @param originalEngine
 * @returns engine
 */
export const useEngineKeepState = <Names extends string>(
	originalEngine: Engine<Names>
) => {
	const { current: engine } = useRef(originalEngine)

	return engine
}

const ExonérationCovidProvider = () => {
	const engine = useEngineKeepState(exoCovidEngine)

	return (
		<EngineProvider value={engine}>
			<ExonérationCovid />
		</EngineProvider>
	)
}

export default ExonérationCovidProvider
