import { updateSituation } from 'Actions/actions'
import Banner from 'Components/Banner'
import ChiffreAffairesActivitéMixte from 'Components/ChiffreAffairesActivitéMixte'
import { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import IndépendantExplanation from 'Components/simulationExplanation/IndépendantExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Radio, ToggleGroup } from 'DesignSystem/field'
import { DottedName } from 'modele-social'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export function IndépendantPLSimulation() {
	return (
		<>
			<SimulateurWarning simulateur="profession-libérale" />
			<Simulation explanations={<IndépendantExplanation />}>
				<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
			</Simulation>
		</>
	)
}

export function EntrepriseIndividuelle() {
	return (
		<>
			<SimulateurWarning simulateur="entreprise-individuelle" />
			<Simulation explanations={<IndépendantExplanation />}>
				<IndépendantSimulationGoals legend="Vos revenus d'entreprise individuelle" />
			</Simulation>
		</>
	)
}

export default function IndépendantSimulation() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<SimulateurWarning simulateur="indépendant" />
			<Simulation explanations={<IndépendantExplanation />}>
				<IndépendantSimulationGoals
					legend="Vos revenus d'indépendant"
					toggles={
						<StyledToggleContainer>
							<ImpositionSwitch />
							<PeriodSwitch />
						</StyledToggleContainer>
					}
				/>
				<Banner icon={'✍️'}>
					<Trans i18nKey="aide-déclaration-indépendant.banner">
						Découvrez notre outil d'
						<Link to={sitePaths.gérer.déclarationIndépendant}>
							aide à la déclaration des revenus
						</Link>
					</Trans>
				</Banner>
			</Simulation>
		</>
	)
}
const StyledToggleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap-reverse;
	gap: ${({ theme }) => theme.spacings.md};
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		justify-content: center;
	}
`

function IndépendantSimulationGoals({
	toggles = <PeriodSwitch />,
	legend,
}: {
	toggles?: React.ReactNode
	legend: string
}) {
	return (
		<SimulationGoals toggles={toggles} legend={legend}>
			<Condition expression="entreprise . imposition = 'IR'">
				<Condition expression="entreprise . imposition . IR . micro-fiscal = non">
					<SimulationGoal
						appear={false}
						alwaysShow
						dottedName="entreprise . chiffre d'affaires"
					/>
				</Condition>
				<Condition expression="entreprise . imposition . IR . micro-fiscal">
					<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
				</Condition>
				<Condition expression="entreprise . imposition . IR . micro-fiscal != oui">
					<SimulationGoal
						small
						appear={false}
						dottedName="entreprise . charges"
					/>
				</Condition>
			</Condition>
			<Condition expression="entreprise . imposition = 'IS'">
				<SimulationGoal
					appear={false}
					dottedName="dirigeant . rémunération . totale"
				/>
			</Condition>

			<SimulationGoal
				small
				editable={false}
				alwaysShow
				dottedName="dirigeant . indépendant . cotisations et contributions"
			/>
			<Condition expression="entreprise . imposition . IR . micro-fiscal">
				<SimulationGoal
					small
					appear={false}
					dottedName="entreprise . charges"
				/>
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette" />
			<Condition expression="impôt . montant > 0">
				<SimulationGoal small editable={false} dottedName="impôt . montant" />
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . nette après impôt" />
		</SimulationGoals>
	)
}

function ImpositionSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentImposition = engine.evaluate('entreprise . imposition').nodeValue

	return (
		<ToggleGroup
			defaultValue={currentImposition as string}
			onChange={(imposition) =>
				dispatch(updateSituation('entreprise . imposition', `'${imposition}'`))
			}
		>
			{(['IR', 'IS'] as const).map((imposition) => (
				<span
					key={imposition}
					className={currentImposition !== imposition ? 'print-hidden' : ''}
				>
					<Radio value={imposition}>
						{
							engine.getRule(
								`entreprise . imposition . ${imposition}` as DottedName
							).title
						}
					</Radio>
				</span>
			))}
		</ToggleGroup>
	)
}
