import { updateSituation } from 'Actions/actions'
import { HiddenOptionContext } from 'Components/conversation/ChoicesInput'
import { Condition } from 'Components/EngineValue'
import Notifications from 'Components/Notifications'
import Simulation from 'Components/Simulation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import StackedBarChart from 'Components/StackedBarChart'
import Warning from 'Components/ui/WarningBlock'
import { useEngine } from 'Components/utils/EngineContext'
import { Radio, ToggleGroup } from 'DesignSystem/field'
import { H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ThemeContext } from 'styled-components'

export default function DividendesSimulation() {
	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:dividendes'}
			>
				<Trans i18nKey="dividendes.warning">
					<Body>
						Cette simulation est uniquement donnée à titre indicatif. Elle ne
						concerne que les sociétés françaises à l’impôt sur les sociétés
						(IS), et ne concerne pas les travailleurs indépendants non salariés.
					</Body>
					<Body>
						Le montant de l'impôt sur les dividendes est calculé en sus de
						l’impôt sur les autres revenus imposables.
					</Body>
				</Trans>
			</Warning>
			<Notifications />
			<HiddenOptionContext.Provider value={['dirigeant . auto-entrepreneur']}>
				<Simulation explanations={<DividendesExplanation />}>
					<div
						css={`
							display: flex;
							flex-wrap: wrap-reverse;
							> * {
								margin-top: 0.6rem;
							}
							justify-content: center;

							@media (min-width: 590px) {
								justify-content: space-between;
							}
						`}
					></div>
					<DividendesSimulationGoals />
				</Simulation>
			</HiddenOptionContext.Provider>
		</>
	)
}

function OptionBarèmeSwitch() {
	const dispatch = useDispatch()
	const engine = useEngine()
	const dottedName = 'impôt . méthode de calcul' as DottedName
	const currentOptionPFU = engine.evaluate(dottedName).nodeValue as string
	return (
		<ToggleGroup
			defaultValue={currentOptionPFU}
			onChange={(value) => dispatch(updateSituation(dottedName, `'${value}'`))}
		>
			<Radio value="PFU">
				<Trans>
					PFU (<i>"flat tax"</i>)
				</Trans>
			</Radio>
			<Radio value="barème standard">
				<Trans>Impôt au barème</Trans>
			</Radio>
		</ToggleGroup>
	)
}

const DividendesSimulationGoals = () => (
	<SimulationGoals
		toggles={<OptionBarèmeSwitch />}
		legend="Les dividendes de l'entreprise"
	>
		<Condition expression="entreprise . imposition = 'IS'">
			<SimulationGoal
				appear={false}
				alwaysShow
				dottedName="bénéficiaire . dividendes . bruts"
			/>

			<Condition expression="impôt . méthode de calcul . barème standard">
				<SimulationGoal
					small
					appear={false}
					dottedName="impôt . foyer fiscal . revenu imposable . autres revenus imposables"
				/>
			</Condition>
			<Condition expression="oui">
				<SimulationGoal
					appear={false}
					alwaysShow
					dottedName="bénéficiaire . dividendes . nets d'impôt"
				/>
			</Condition>
		</Condition>
	</SimulationGoals>
)

const DividendesExplanation = () => {
	const { t } = useTranslation()
	const { colors } = useContext(ThemeContext)

	return (
		<Condition expression="bénéficiaire . dividendes . bruts > 0">
			<section id="simulateur-dividendes-section-total">
				<div
					css={`
						display: flex;
						align-items: baseline;
					`}
				>
					<H3 as="h2">
						<Trans i18nKey="payslip.repartition">
							Répartition du total chargé
						</Trans>
					</H3>
				</div>
				<StackedBarChart
					precision={0.1}
					data={[
						{
							dottedName: "bénéficiaire . dividendes . nets d'impôt",
							title: t('Dividendes nets'),
							color: colors.bases.primary[600],
						},
						{
							dottedName:
								'impôt . dividendes . montant en sus des autres revenus imposables',
							title: t('Impôt'),
							color: colors.bases.secondary[500],
						},
						{
							dottedName:
								'bénéficiaire . dividendes . cotisations et contributions',
							title: t('Cotisations'),
							color: colors.bases.secondary[300],
						},
					]}
				/>
			</section>
		</Condition>
	)
}
