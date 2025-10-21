import Engine from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { deleteFromSituation } from '@/store/actions/actions'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import {
	completeSituationSelector,
	configSituationSelector,
	situationSelector,
} from '@/store/selectors/simulationSelectors'
import { safeSetSituation } from '@/utils/publicodes/safeSetSituation'

export const useRawSituation = () => useSelector(completeSituationSelector)

export const useSetupSafeSituation = (engine: Engine<DottedName>) => {
	const dispatch = useDispatch()
	const rawSituation = useRawSituation()
	console.log('useSetupSafeSituation', rawSituation)
	const simulatorSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const companySituation = useSelector(companySituationSelector)

	try {
		safeSetSituation(engine, rawSituation, ({ faultyDottedName }) => {
			if (!faultyDottedName) {
				throw new Error('Bad empty faultyDottedName')
			}

			if (faultyDottedName in simulatorSituation) {
				dispatch(deleteFromSituation(faultyDottedName))
			} else {
				throw new Error(
					'Bad ' +
						(faultyDottedName in configSituation
							? 'config'
							: faultyDottedName in companySituation
							? 'company'
							: 'unknow') +
						' situation : ' +
						JSON.stringify(faultyDottedName)
				)
			}
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		engine.setSituation()
	}
}

export function useInversionFail() {
	return false

	// const engine = useEngine()
	// const objectifs = useSelector(configObjectifsSelector).map(
	// 	(objectif) => engine.evaluate(objectif).nodeValue
	// )

	// const inversionFail =
	// 	engine.inversionFail() && objectifs.some((o) => o === undefined)

	// return false

	// return inversionFail
}
