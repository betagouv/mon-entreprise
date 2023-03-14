import { DottedName } from 'modele-social'
import { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { ThemeContext } from 'styled-components'

import { Condition } from '@/components/EngineValue'
import Notifications from '@/components/Notifications'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import StackedBarChart from '@/components/StackedBarChart'
import Warning from '@/components/ui/WarningBlock'
import { useEngine } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system/field'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { updateSituation } from '@/store/actions/actions'

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
			<Simulation explanations={<DividendesExplanation />}>
				<DividendesSimulationGoals />
			</Simulation>
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
			<SimulationGoal
				appear={false}
				dottedName="bénéficiaire . dividendes . nets d'impôt"
			/>
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
							color: colors.extended.grey[700],
						},
					]}
				/>
			</section>
		</Condition>
	)
}

export const SeoExplanations = () => {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.dividendes.seo">
			<H2>Les dividendes et distributions</H2>
			<Body>
				À la fin de l'exercice d'une société, le résultat de l'exercice
				précédent peut être conservé en réserve (pour de futurs investissements)
				ou bien être versé en dividendes. Du point de vue des bénéficiaires, ce
				sont des revenus de capitaux mobiliers, soumis à cotisations et à une
				imposition spécifiques.
			</Body>
			<Body>
				Ne sont pris en compte dans ce simulateur que les cas de figure du
				bénéficiaire personne physique et des dividendes décidés par la société.
			</Body>
			<H2>Comment sont calculés les prélèvements sur les dividendes ?</H2>
			<Body>
				Les dividendes peuvent être soumis au prélèvement forfaitaire unique de
				30% incluant imposition et contributions sociales (aussi appelé
				<i> flat tax</i>). Par option, le barème de l'impôt peut être choisi. Ce
				simulateur peut être utilisé pour comparer les deux régimes.
			</Body>
			<Body>
				Un acompte du montant de l'impôt (12,8%) est prélevé au moment du
				versement des dividendes, sauf si le bénéficiaire remplit{' '}
				<a
					target="_blank"
					rel="noreferrer"
					aria-label={t(
						'certains critères, en savoir plus sur service-public.fr, nouvelle fenêtre'
					)}
					href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F32963"
				>
					certains critères
				</a>
				.
			</Body>
			<H2>Cas particulier du dirigeant non salarié</H2>
			<Body>
				Pour le travailleur indépendant non salarié, la part des dividendes
				dépassant 10% du capital social sera soumise aux cotisations et
				contributions suivant les mêmes modalités que sa rémunération de
				dirigeant.
			</Body>
			<Body>
				Ce cas de figure n'est pas encore pris en compte par ce simulateur.
			</Body>
		</Trans>
	)
}
