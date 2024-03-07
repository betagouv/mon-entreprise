import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'

import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
import RuleInput from '@/components/conversation/RuleInput'
import { Condition } from '@/components/EngineValue/Condition'
import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { enregistreLaRéponse } from '@/store/actions/actions'

export function IndépendantPLSimulation() {
	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="profession-libérale" />
				<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
			</Simulation>
		</>
	)
}

export function EntrepriseIndividuelle() {
	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="entreprise-individuelle" />
				<IndépendantSimulationGoals legend="Vos revenus d'entreprise individuelle" />
			</Simulation>
		</>
	)
}

export const SeoExplanationsEI = () => (
	<Trans i18nKey="pages.simulateurs.ei.seo explanation">
		<H2>
			Comment calculer le revenu net d'un dirigeant d'entreprise individuelle
			(EI) ?
		</H2>
		<Body>
			Un dirigeant d'entreprise individuelle doit payer des cotisations et
			contributions sociales à l'administration. Ces cotisations servent au
			financement de la sécurité sociale, et ouvrent des droits notamment pour
			la retraite et pour l'assurance maladie. Elles permettent également de
			financer la formation professionnelle.
		</Body>
		<Body>
			<Emoji emoji="👉" />{' '}
			<RuleLink dottedName="dirigeant . indépendant . cotisations et contributions">
				Voir le détail du calcul des cotisations
			</RuleLink>
		</Body>
		<Body>
			Il ne faut pas oublier de retrancher toutes les dépenses effectuées dans
			le cadre de l'activité professionnelle (équipements, matières premières,
			local, transport). Ces dernières sont déductibles du résultat de
			l'entreprise, cela veut dire que vous ne payerez pas d'impôt ou de
			cotisations sur leur montant (sauf si vous avez opté pour l'option
			micro-fiscal).
		</Body>
		<Body>La formule de calcul complète est donc :</Body>
		<Message
			role="presentation"
			mini
			border={false}
			style={{
				width: 'fit-content',
			}}
		>
			Revenu net = Chiffres d'affaires − Dépenses professionnelles - Cotisations
			sociales
		</Message>
		<H2>
			Comment calculer les cotisations sociales d'une entreprise individuelle ?
		</H2>
		<Body>
			Le dirigeant d'une entreprise individuelle paye des cotisations sociales,
			proportionnelle au{' '}
			<RuleLink dottedName="entreprise . résultat fiscal">
				résultat fiscal
			</RuleLink>{' '}
			de l'entreprise. Leur montant varie également en fonction du type
			d'activité (profession libérale, artisan, commerçants, etc), où des
			éventuelles exonérations accordées (ACRE, ZFU, RSA, etc.).
		</Body>
		<Body>
			{' '}
			Comme le résultat d'une entreprise n'est connu qu'à la fin de l'exercice
			comptable, le dirigeant paye des cotisations provisionnelles qui seront
			ensuite régularisée une fois le revenu réel déclaré, l'année suivante.
		</Body>
		<Body>
			Ce simulateur permet de calculer le montant exact des cotisations sociale
			en partant d'un chiffre d'affaires ou d'un revenu net souhaité. Vous
			pourrez préciser votre situation en répondant aux questions s'affichant en
			dessous de la simulation.
		</Body>
	</Trans>
)

export default function IndépendantSimulation() {
	const dispatch = useDispatch()

	return (
		<>
			<Simulation
				explanations={<IndépendantExplanation />}
				afterQuestionsSlot={<SelectSimulationYear />}
			>
				<SimulateurWarning simulateur="indépendant" />
				<IndépendantSimulationGoals
					legend="Vos revenus d'indépendant"
					toggles={
						<>
							<RuleInput
								inputType="toggle"
								hideDefaultValue
								missing={false}
								dottedName="entreprise . imposition"
								onChange={(imposition) => {
									dispatch(
										enregistreLaRéponse('entreprise . imposition', imposition)
									)
								}}
							/>
							<PeriodSwitch />
						</>
					}
				/>
			</Simulation>
		</>
	)
}

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
				<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
					<SimulationGoal
						appear={false}
						dottedName="entreprise . chiffre d'affaires"
					/>
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise">
					<ChiffreAffairesActivitéMixte dottedName="entreprise . chiffre d'affaires" />
				</Condition>
				<Condition expression="entreprise . imposition . régime . micro-entreprise != oui">
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
				dottedName="dirigeant . indépendant . cotisations et contributions"
			/>
			<Condition expression="entreprise . imposition . régime . micro-entreprise">
				<SimulationGoal
					small
					appear={false}
					dottedName="entreprise . charges"
				/>
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . net" />
			<Condition expression="impôt . montant > 0">
				<SimulationGoal small editable={false} dottedName="impôt . montant" />
			</Condition>
			<SimulationGoal dottedName="dirigeant . rémunération . net . après impôt" />
		</SimulationGoals>
	)
}
