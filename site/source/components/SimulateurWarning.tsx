import { ReactNode } from 'react'
import { Trans } from 'react-i18next'

import SimulationChargéeBanner from '@/components/Simulation/SimulationChargéeBanner'
import Warning from '@/components/ui/WarningBlock'
import { Body, Emoji, Strong } from '@/design-system'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'

type SimulateurWarningProps = {
	simulateur: SimulateurId
	informationsComplémentaires?: ReactNode
}

export default function SimulateurWarning({
	simulateur,
	informationsComplémentaires,
}: SimulateurWarningProps) {
	const { beta } = useSimulatorData(simulateur)

	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:' + simulateur}
			>
				{beta && (
					<Body>
						<Trans i18nKey="simulateurs.warning.beta">
							<Emoji emoji="🚧" />{' '}
							<Strong>Cet outil est en version bêta</Strong>&nbsp;: nous
							travaillons à valider les informations et les calculs, mais
							<Strong>des erreurs peuvent être présentes</Strong>.
						</Trans>
					</Body>
				)}

				{informationsComplémentaires && <>{informationsComplémentaires}</>}

				<Body>
					<Trans i18nKey="simulateurs.warning.general">
						<Strong>Les calculs sont indicatifs.</Strong> Ils sont faits à
						partir des éléments que vous avez saisis et des éléments
						réglementaires applicables, mais ils ne tiennent pas compte de
						l'ensemble de votre situation.{' '}
						<Strong>Ils ne se substituent pas aux décomptes réels</Strong> de
						l'Urssaf, de l'administration fiscale ou de tout autre organisme.
					</Trans>
				</Body>
			</Warning>
			<SimulationChargéeBanner />
		</>
	)
}
