import { useDispatch, useSelector } from 'react-redux'

import { setEngineSituation } from '@/domaine/engine/engineCache'
import { NomModèle } from '@/domaine/SimulationConfig'
import { supprimeLaRègleDeLaSituation } from '@/store/actions/actions'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'
import { completeSituationSelector } from '@/store/selectors/completeSituation.selector'
import { configSituationSelector } from '@/store/selectors/simulation/config/configSituation.selector'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'
import { règleObsolèteDétectée } from '@/store/slices/simulationSource.slice'
import { décideActionRègleInvalide } from '@/utils/publicodes/décideActionRègleInvalide'
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
		safeSetSituation(
			(s) => setEngineSituation(nomModèle, s),
			completeSituation,
			({ faultyDottedName }) => {
				if (!faultyDottedName) {
					throw new Error('Bad empty faultyDottedName')
				}

				const action = décideActionRègleInvalide(faultyDottedName, {
					situationDuSimulateur: simulatorSituation,
					situationDeLEntreprise: companySituation,
					situationDeConfiguration: configSituation,
				})

				switch (action.kind) {
					case 'omettre-et-marquer-obsolète':
						dispatch(supprimeLaRègleDeLaSituation(action.règle))
						dispatch(règleObsolèteDétectée(action.règle))
						break
					case 'omettre':
						dispatch(supprimeLaRègleDeLaSituation(action.règle))
						break
					case 'erreur-inconnue':
						throw new Error(
							`Bad unknown situation : ${JSON.stringify(action.règle)}`
						)
				}
			}
		)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		setEngineSituation(nomModèle, {})
	}
}
