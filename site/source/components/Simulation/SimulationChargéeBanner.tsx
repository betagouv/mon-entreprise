import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import SimulationBanner from '@/components/Simulation/Banner'
import { Link } from '@/design-system'
import { simulationSourceSelector } from '@/store/selectors/simulationSource.selector'
import {
	fermeLeBandeau,
	OrigineSimulation,
} from '@/store/slices/simulationSource.slice'

const icôneParOrigine: Record<OrigineSimulation, string> = {
	[OrigineSimulation.LIEN_PARTAGÉ]: '🔗',
	[OrigineSimulation.SAUVEGARDE]: '💾',
}

export default function SimulationChargéeBanner() {
	const simulationSource = useSelector(simulationSourceSelector)
	const dispatch = useDispatch()

	if (!simulationSource) {
		return null
	}

	const { origine, règlesObsolètes } = simulationSource
	const aDesRèglesIgnorées = règlesObsolètes.length > 0

	return (
		<SimulationBanner icon={aDesRèglesIgnorées ? '⚠️' : icôneParOrigine[origine]}>
			{origine === OrigineSimulation.LIEN_PARTAGÉ && (
				<Trans i18nKey="simulationChargéeBanner.lienPartagé">
					Cette simulation a été chargée depuis un lien partagé.
				</Trans>
			)}
			{origine === OrigineSimulation.SAUVEGARDE && (
				<Trans i18nKey="simulationChargéeBanner.sauvegarde">
					Votre simulation précédente a été restaurée.
				</Trans>
			)}
			{aDesRèglesIgnorées && (
				<>
					{' '}
					<Trans i18nKey="simulationChargéeBanner.règlesDéfaillantes">
						Certains paramètres n'ont pas pu être appliqués suite à une
						évolution du simulateur.
					</Trans>
				</>
			)}
			{' '}
			<Link onPress={() => dispatch(fermeLeBandeau())}>
				<Trans i18nKey="simulationChargéeBanner.fermer">Fermer</Trans>
			</Link>
		</SimulationBanner>
	)
}
