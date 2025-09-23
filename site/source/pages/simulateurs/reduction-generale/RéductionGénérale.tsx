import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, Link, Strong } from '@/design-system'
import { useSitePaths } from '@/sitePaths'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import CongésPayésSwitch from './components/CongésPayésSwitch'
import RéductionGénéraleSimulationGoals from './Goals'

export default function RéductionGénéraleSimulation() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()
	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<>
			<Simulation afterQuestionsSlot={<YearSelectionBanner />}>
				<SimulateurWarning
					simulateur="réduction-générale"
					informationsComplémentaires={
						<Trans i18nKey="pages.simulateurs.réduction-générale.warning">
							<Body>
								Ce simulateur n’intègre{' '}
								<Strong>pas toutes les règles de calcul</Strong> spécifiques
								(Entreprises de Travail Temporaire, salariés des transports
								routiers soumis à un horaire d’équivalence...). Il ne tient pas
								non plus compte des taux et/ou répartition particuliers de la
								cotisation de retraite complémentaire appliqués dans certaines
								entreprises.
							</Body>
							<Body>
								En outre-mer, il est possible de choisir entre la réduction
								générale des cotisations et une autre exonération&nbsp;: accéder
								au{' '}
								<Link
									to={absoluteSitePaths.simulateurs.lodeom}
									aria-label={t(
										'pages.simulateurs.réduction-générale.warning-link',
										'aller sur la page du simulateur d’exonération Lodeom'
									)}
								>
									simulateur d’exonération Lodeom
								</Link>
								.
							</Body>
						</Trans>
					}
				/>
				<RéductionGénéraleSimulationGoals
					toggles={
						<>
							<RégularisationSwitch
								régularisationMethod={régularisationMethod}
								setRégularisationMethod={setRégularisationMethod}
							/>
							<EffectifSwitch />
							<CongésPayésSwitch />
						</>
					}
					régularisationMethod={régularisationMethod}
				/>
			</Simulation>
		</>
	)
}
