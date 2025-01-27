import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { AutoEntrepreneurDétails } from '@/pages/simulateurs/auto-entrepreneur/AutoEntrepreneurDétails'

export default function AutoEntrepreneur() {
	return (
		<>
			<Simulation
				explanations={<AutoEntrepreneurDétails />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning
					simulateur="auto-entrepreneur"
					informationsComplémentaires={
						<Ul>
							<StyledLi>
								<Trans i18nKey="simulateurs.warning.auto-entrepreneur">
									Les auto-entrepreneurs bénéficient d’un régime très simplifié
									avec un taux forfaitaire pour le calcul des cotisations et
									contributions sociales appliqué sur le chiffre d’affaires.
									Selon le choix de la modalité de paiement des impôts il est
									appliqué un abattement forfaitaire au titre des frais
									professionnels. Il n’est pas possible de déduire des charges
									réelles en plus. Votre revenu net est donc le chiffre
									d’affaires moins toutes les charges engagées pour
									l’entreprise.
								</Trans>
							</StyledLi>
							<StyledLi>
								<Trans i18nKey="simulateurs.warning.cfe">
									Le simulateur n’intègre pas la cotisation foncière des
									entreprise (CFE) qui est dûe dès la deuxième année d’exercice.
									Son montant varie fortement en fonction du chiffre d’affaires
									et de la domiciliation de l’entreprise.{' '}
									<Link
										aria-label="Plus d’infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
										href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547"
									>
										Plus d’infos.
									</Link>
								</Trans>
							</StyledLi>
						</Ul>
					}
				/>
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus d'auto-entrepreneur"
				>
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
		</>
	)
}

const StyledLi = styled(Li)`
	&::before {
		color: ${({ theme }) => theme.colors.bases.tertiary[800]} !important;
	}
`
