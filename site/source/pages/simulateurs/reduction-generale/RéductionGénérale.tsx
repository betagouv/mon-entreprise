import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { SimulationValue } from '@/components/Simulation/SimulationValue'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import EffectifSwitch from './components/EffectifSwitch'

export default function RéductionGénéraleSimulation() {
	return (
		<>
			<Simulation afterQuestionsSlot={<SelectSimulationYear />}>
				<SimulateurWarning simulateur="réduction-générale" />
				<RéductionGénéraleSimulationGoals
					legend="Salaire brut du salarié et réduction générale applicable"
					toggles={
						<>
							<EffectifSwitch />
							<PeriodSwitch />
						</>
					}
				/>
			</Simulation>
		</>
	)
}

const StyledUl = styled(Ul)`
	margin-top: 0;
`
const StyledLi = styled(Li)`
	&::before {
		margin-top: ${({ theme }) => theme.spacings.sm};
	}
`
function RéductionGénéraleSimulationGoals({
	toggles = (
		<>
			<EffectifSwitch />
			<PeriodSwitch />
		</>
	),
	legend,
}: {
	toggles?: React.ReactNode
	legend: string
}) {
	const { t } = useTranslation()

	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			{/* TODO: remplacer "salarié . cotisations . assiette" par "salarié . rémunération . brut"
					lorsqu'elle n'incluera plus les frais professionnels. */}
			<SimulationGoal
				dottedName="salarié . cotisations . assiette"
				round={false}
				label={t('Rémunération brute', 'Rémunération brute')}
			/>

			<Condition expression="salarié . cotisations . exonérations . JEI = oui">
				<Message type="info">
					<Body>
						<Trans>
							La réduction générale n'est pas cumulable avec l'exonération Jeune
							Entreprise Innovante (JEI).
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . contrat = 'stage'">
				<Message type="info">
					<Body>
						<Trans>
							La réduction générale ne s'applique pas sur les gratifications de
							stage.
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . cotisations . exonérations . réduction générale = 0">
				<Message type="info">
					<Body>
						<Trans>
							La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.
							C'est-à-dire, pour 2024, une rémunération totale qui ne dépasse
							pas <strong>2 827,07 €</strong> bruts par mois.
						</Trans>
					</Body>
				</Message>
			</Condition>

			<Condition expression="salarié . cotisations . exonérations . réduction générale >= 0">
				<SimulationValue
					dottedName="salarié . cotisations . exonérations . réduction générale"
					isInfoMode={true}
					round={false}
				/>
				<Spacing md />
				<StyledUl>
					<StyledLi>
						<SimulationValue
							dottedName={
								'salarié . cotisations . exonérations . réduction générale . part retraite'
							}
							round={false}
						/>
					</StyledLi>
					<StyledLi>
						<SimulationValue
							dottedName={
								'salarié . cotisations . exonérations . réduction générale . part Urssaf'
							}
							round={false}
						/>
						<SimulationValue
							dottedName={
								'salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage'
							}
							round={false}
							label={t('dont chômage', 'dont chômage')}
						/>
					</StyledLi>
				</StyledUl>
			</Condition>
		</SimulationGoals>
	)
}
