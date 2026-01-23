import { Trans, useTranslation } from 'react-i18next'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DistributionBranch } from '@/components/simulationExplanation/ÀQuoiServentMesCotisations/DistributionDesCotisations'
import { typography } from '@/design-system'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import InstitutionsPartenaires from '@/pages/simulateurs/artiste-auteur/components/InstitutionsPartenaires'
import { URSSAF } from '@/utils/logos'
import { EngineProvider, useEngine } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'

const { Body, H2 } = typography

export function ArtisteAuteur() {
	const id = 'artiste-auteur'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine, questions, raccourcis } =
		useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://www.urssaf.fr/accueil/services/services-artisteauteur-diffuseur/service-artiste-auteur.html',
			title: t(
				'pages.simulateurs.artiste-auteur.externalLinks.1.title',
				'Le service en ligne Artiste-auteur'
			),
			description: t(
				'external-links.service.description',
				'L’Urssaf met à votre disposition un service en ligne. Il vous permet de gérer votre activité, contacter un conseiller et retrouver tous vos documents.'
			),
			logo: URSSAF,
			ctaLabel: t('external-links.service.ctaLabel', 'Accéder au service'),
			ariaLabel: t(
				'external-links.service.ariaLabel',
				'Accéder au service sur urssaf.fr, nouvelle fenêtre'
			),
		},
	]

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				externalLinks={externalLinks}
			>
				<Simulation
					questionsPublicodes={questions}
					raccourcisPublicodes={raccourcis}
					results={<InstitutionsPartenaires />}
					explanations={<CotisationsResult />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur="artiste-auteur"
						informationsComplémentaires={
							<Body>
								<Trans i18nKey="pages.simulateurs.artiste-auteur.warning">
									Ce simulateur permet d’estimer le montant de vos cotisations à
									partir de votre revenu projeté.
								</Trans>
							</Body>
						}
					/>
					<SimulationGoals>
						<PeriodSwitch />
						<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
						<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
						<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
					</SimulationGoals>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}

function CotisationsResult() {
	return (
		<>
			<Condition expression="artiste-auteur . cotisations > 0">
				<RepartitionCotisations />
			</Condition>
		</>
	)
}

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . IRCEC',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS',
		icon: '🏛',
	},
	{
		dottedName: 'artiste-auteur . cotisations . formation professionnelle',
		icon: '👷‍♂️',
	},
] as const

function RepartitionCotisations() {
	const engine = useEngine()
	const cotisations = branches.map((branch) => ({
		...branch,
		value: engine.evaluate(branch.dottedName).nodeValue as number,
	}))
	const maximum = Math.max(...cotisations.map((x) => x.value))

	return (
		<section>
			<H2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</H2>
			<div className="distribution-chart__container" role="list">
				{cotisations
					.filter(({ value }) => Boolean(value))
					.map((cotisation) => (
						<DistributionBranch
							key={cotisation.dottedName}
							maximum={maximum}
							role="listitem"
							{...cotisation}
						/>
					))}
			</div>
		</section>
	)
}
