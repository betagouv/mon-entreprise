import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import EffectifSwitch from '@/components/RéductionDeCotisations/EffectifSwitch'
import RégularisationSwitch from '@/components/RéductionDeCotisations/RégularisationSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import AvertissementRéformeRGDUNonImplémentée from '@/components/Simulation/Avertissements/AvertissementRéformeRGDUNonImplémentée'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { Body, Link, Message, Strong } from '@/design-system'
import { embaucherGérerSalariés } from '@/external-links/embaucherGérerSalariés'
import { nouvelEmployeur } from '@/external-links/nouvelEmployeur'
import { serviceEmployeur } from '@/external-links/serviceEmployeur'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'
import { URSSAF } from '@/utils/logos'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { RégularisationMethod } from '@/utils/réductionDeCotisations'

import SimulateurPageLayout from '../SimulateurPageLayout'
import CongésPayésSwitch from './components/CongésPayésSwitch'
import RéductionGénéraleSimulationGoals from './Goals'

const nextSteps = ['salarié'] satisfies SimulateurId[]

export default function RéductionGénéraleSimulation() {
	const id = 'réduction-générale'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/employeur/beneficier-exonerations/reduction-generale-cotisation.html',
			title: t(
				'pages.simulateurs.réduction-générale.externalLinks.1.title',
				'La réduction générale des cotisations'
			),
			description: t(
				'pages.simulateurs.réduction-générale.externalLinks.1.description',
				'Calcul, déclaration, règles... Consultez le guide de l’Urssaf sur la réduction générale des cotisations.'
			),
			logo: URSSAF,
			ctaLabel: t(
				'pages.simulateurs.réduction-générale.externalLinks.1.ctaLabel',
				'Consulter le guide'
			),
			ariaLabel: t(
				'pages.simulateurs.réduction-générale.externalLinks.1.ariaLabel',
				'Consulter le guide sur urssaf.fr, nouvelle fenêtre'
			),
		},
		serviceEmployeur,
		embaucherGérerSalariés,
		nouvelEmployeur,
	]

	const { absoluteSitePaths } = useSitePaths()

	const [régularisationMethod, setRégularisationMethod] =
		useState<RégularisationMethod>('progressive')

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation afterQuestionsSlot={<YearSelectionBanner />}>
					<SimulateurWarning
						simulateur="réduction-générale"
						informationsComplémentaires={
							<>
								<Message type="error">
									<AvertissementRéformeRGDUNonImplémentée />
								</Message>
								<Trans i18nKey="pages.simulateurs.réduction-générale.warning.texte">
									<Body>
										Ce simulateur n’intègre{' '}
										<Strong>pas toutes les règles de calcul</Strong> spécifiques
										(Entreprises de Travail Temporaire, salariés des transports
										routiers soumis à un horaire d’équivalence...). Il ne tient
										pas non plus compte des taux et/ou répartition particuliers
										de la cotisation de retraite complémentaire appliqués dans
										certaines entreprises.
									</Body>
									<Body>
										En outre-mer, il est possible de choisir entre la réduction
										générale des cotisations et une autre exonération&nbsp;:
										accéder au{' '}
										<Link
											to={absoluteSitePaths.simulateurs.lodeom}
											aria-label={t(
												'pages.simulateurs.réduction-générale.warning.aria-label.lodeom',
												'aller sur la page du simulateur d’exonération Lodeom'
											)}
										>
											simulateur d’exonération Lodeom
										</Link>
										.
									</Body>
								</Trans>
							</>
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
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
