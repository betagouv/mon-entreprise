import { Trans, useTranslation } from 'react-i18next'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DarkLi, Link, Ul } from '@/design-system'
import { premiersMoisUrssaf } from '@/external-links/premiersMoisUrssaf'
import { serviceAutoEntrepreneur } from '@/external-links/serviceAutoEntrepreneur'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import ExplicationsAutoEntrepreneur from '@/pages/simulateurs/auto-entrepreneur/components/Explications'
import { URSSAF } from '@/utils/logos'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'

const nextSteps = [
	'indépendant',
	'comparaison-statuts',
] satisfies SimulateurId[]

export default function AutoEntrepreneur() {
	const id = 'auto-entrepreneur'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	const externalLinks = [
		{
			url: 'https://autoentrepreneur.urssaf.fr',
			title: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.1.title',
				'Site officiel des auto-entrepreneurs'
			),
			description: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.1.description',
				'Vous pourrez effectuer votre déclaration de chiffre d’affaires, payer vos cotisations, et plus largement trouver toutes les informations relatives au statut d’auto-entrepreneur.'
			),
			ctaLabel: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.1.ctaLabel',
				'Visiter le site'
			),
			ariaLabel: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.1.ariaLabel',
				'Visiter le site auto-entrepreneur.urssaf.fr, nouvelle fenêtre.'
			),
		},
		serviceAutoEntrepreneur,
		{
			url: 'https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/guide-officiel.html',
			title: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.2.title',
				'Guides pratiques de l’auto-entrepreneur'
			),
			description: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.2.description',
				'Les guides de l’Urssaf dédiés aux auto-entrepreneurs et auto-entrepreneuses.'
			),
			logo: URSSAF,
			ctaLabel: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.2.ctaLabel',
				'Voir les guides'
			),
			ariaLabel: t(
				'pages.simulateurs.auto-entrepreneur.externalLinks.2.ariaLabel',
				'Voir les guides sur auto-entrepreneur.urssaf.fr, nouvelle fenêtre.'
			),
		},
		premiersMoisUrssaf,
	]

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
				externalLinks={externalLinks}
			>
				<Simulation
					explanations={<ExplicationsAutoEntrepreneur />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur="auto-entrepreneur"
						informationsComplémentaires={
							<Ul>
								<DarkLi>
									<Trans i18nKey="pages.simulateurs.auto-entrepreneur.warning.general">
										Les auto-entrepreneurs bénéficient d’un régime très
										simplifié avec un taux forfaitaire pour le calcul des
										cotisations et contributions sociales appliqué sur le
										chiffre d’affaires. Selon le choix de la modalité de
										paiement des impôts il est appliqué un abattement
										forfaitaire au titre des frais professionnels. Il n’est pas
										possible de déduire des charges réelles en plus. Votre
										revenu net est donc le chiffre d’affaires moins toutes les
										charges engagées pour l’entreprise.
									</Trans>
								</DarkLi>
								<DarkLi>
									<Trans i18nKey="pages.simulateurs.auto-entrepreneur.warning.cfe">
										Le simulateur n’intègre pas la cotisation foncière des
										entreprise (CFE) qui est dûe dès la deuxième année
										d’exercice. Son montant varie fortement en fonction du
										chiffre d’affaires et de la domiciliation de l’entreprise.{' '}
										<Link
											aria-label="Plus d’infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
											href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547"
										>
											Plus d’infos.
										</Link>
									</Trans>
								</DarkLi>
							</Ul>
						}
					/>
					<SimulationGoals>
						<PeriodSwitch />
						<ChiffreAffairesActivitéMixte dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires" />
						<SimulationGoal
							small
							editable={false}
							dottedName="dirigeant . auto-entrepreneur . cotisations et contributions"
						/>
						<SimulationGoal dottedName="dirigeant . auto-entrepreneur . revenu net" />
						<WhenAlreadyDefined dottedName="entreprise . chiffre d'affaires">
							<SimulationGoal
								small
								editable={false}
								dottedName="dirigeant . rémunération . impôt"
							/>
						</WhenAlreadyDefined>
						<SimulationGoal dottedName="dirigeant . auto-entrepreneur . revenu net . après impôt" />
					</SimulationGoals>
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
