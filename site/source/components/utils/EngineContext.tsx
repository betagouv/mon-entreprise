import { useDispatch, useSelector } from 'react-redux'

import { setEngineSituation } from '@/domaine/engine/engineCache'
import { NomModèle } from '@/domaine/SimulationConfig'
import { supprimeLaRègleDeLaSituation } from '@/store/actions/actions'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { completeSituationSelector } from '@/store/selectors/completeSituation.selector'
import { configSituationSelector } from '@/store/selectors/simulation/config/configSituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { safeSetSituation } from '@/utils/publicodes/safeSetSituation'

export const useSetupSafeSituation = (nomModèle?: NomModèle) => {
	const dispatch = useDispatch()
	const completeSituation = useSelector(completeSituationSelector)
	const simulatorSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const companySituation = useSelector(companySituationSelector)

	if (!nomModèle) {
		return
	}

	try {
		safeSetSituation(nomModèle, completeSituation, ({ faultyDottedName }) => {
			if (!faultyDottedName) {
				throw new Error('Bad empty faultyDottedName')
			}

			if (faultyDottedName in simulatorSituation) {
				dispatch(supprimeLaRègleDeLaSituation(faultyDottedName))
			} else {
				const dottedName = JSON.stringify(faultyDottedName)
				let errorMessage = `Bad unknow situation : ${dottedName}`

				if (faultyDottedName in configSituation) {
					errorMessage = `Bad config situation : ${dottedName}`
				} else if (faultyDottedName in companySituation) {
					errorMessage = `Bad company situation : ${dottedName}`
				}

				throw new Error(errorMessage)
			}
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		setEngineSituation(nomModèle, {})
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
