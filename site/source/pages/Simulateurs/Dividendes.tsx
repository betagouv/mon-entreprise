import { DottedName } from 'modele-social'
import { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ThemeContext } from 'styled-components'

import { updateSituation } from '@/actions/actions'
import { Condition } from '@/components/EngineValue'
import Notifications from '@/components/Notifications'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import StackedBarChart from '@/components/StackedBarChart'
import { HiddenOptionContext } from '@/components/conversation/ChoicesInput'
import Warning from '@/components/ui/WarningBlock'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system/field'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

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
	const engineOptionPFU = engine.evaluate(dottedName).nodeValue as string

	const [currentOptionPFU, setCurrentOptionPFU] = useState(engineOptionPFU)

	useEffect(() => {
		if (currentOptionPFU !== engineOptionPFU) {
			setCurrentOptionPFU(engineOptionPFU)
		}
	}, [currentOptionPFU, engineOptionPFU])

	return (
		<ToggleGroup
			value={currentOptionPFU}
			onChange={(value) => {
				setCurrentOptionPFU(value)
				dispatch(updateSituation(dottedName, `'${value}'`))
			}}
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
					<H2>
						<Trans i18nKey="payslip.repartition">
							Répartition du total chargé
						</Trans>
					</H2>
				</div>
				<StackedBarChart
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
