import Banner from '@/components/Banner'
import Value, {
	Condition,
	WhenNotAlreadyDefined,
} from '@/components/EngineValue'
import PeriodSwitch from '@/components/PeriodSwitch'
import RuleLink from '@/components/RuleLink'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation'
import { FromTop } from '@/components/ui/animate'
import BrowserOnly from '@/components/utils/BrowserOnly'
import Emoji from '@/components/utils/Emoji'
import { useEngine } from '@/components/utils/EngineContext'
import { Button } from '@/design-system/buttons'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/selectors/simulationSelectors'
import { useSitePaths } from '@/sitePaths'
import { DottedName } from 'modele-social'
import { ASTNode, reduceAST } from 'publicodes'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const ButtonContainer = styled.span`
	display: block;
	margin: 2rem 1rem;
`

export default function SalariéSimulation() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<Simulation
				explanations={<SalaryExplanation />}
				customEndMessages={
					<>
						<Trans i18nKey="simulation-end.hiring.text">
							Vous pouvez maintenant concrétiser votre projet d'embauche.
						</Trans>
						<ButtonContainer>
							<Button to={absoluteSitePaths.gérer.embaucher}>
								<Trans i18nKey="simulation-end.cta">
									Connaître les démarches
								</Trans>
							</Button>
						</ButtonContainer>
					</>
				}
				afterQuestionsSlot={
					<BrowserOnly>
						{/** L'équipe Code Du Travail Numérique ne souhaite pas référencer
						 * le simulateur dirigeant de SASU sur son site. */}
						{!import.meta.env.SSR &&
							!document.referrer?.includes('code.travail.gouv.fr') && (
								<WhenNotAlreadyDefined dottedName="entreprise . catégorie juridique">
									<Banner icon={'👨‍✈️'}>
										<Trans>
											Vous êtes dirigeant d'une SAS(U) ?{' '}
											<Link to={absoluteSitePaths.simulateurs.sasu}>
												Accéder au simulateur de revenu dédié
											</Link>
										</Trans>
									</Banner>
								</WhenNotAlreadyDefined>
							)}
					</BrowserOnly>
				}
			>
				<SalariéSimulationGoals />
			</Simulation>
		</>
	)
}

function SalariéSimulationGoals() {
	return (
		<SimulationGoals
			toggles={<PeriodSwitch />}
			legend="Rémunération du salarié"
		>
			<SimulationGoal dottedName="contrat salarié . prix du travail" />
			<AidesGlimpse />

			<SimulationGoal dottedName="contrat salarié . rémunération . brut de base" />
			<SimulationGoal
				small
				dottedName="contrat salarié . rémunération . brut de base . équivalent temps plein"
			/>
			<SimulationGoal dottedName="contrat salarié . rémunération . net" />
			<TitreRestaurant />
			<SimulationGoal dottedName="contrat salarié . rémunération . net après impôt" />
		</SimulationGoals>
	)
}

function TitreRestaurant() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName =
		'contrat salarié . frais professionnels . titres-restaurant . montant'

	return (
		<Condition expression={`${dottedName} > 0`}>
			<StyledInfo>
				<FromTop>
					<RuleLink dottedName={dottedName}>
						+{' '}
						<Value
							expression={dottedName}
							displayedUnit="€"
							unit={targetUnit}
						/>
						<Trans>en titres-restaurant</Trans> <Emoji emoji=" 🍽" />
					</RuleLink>
				</FromTop>
			</StyledInfo>
		</Condition>
	)
}

function AidesGlimpse() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName = 'contrat salarié . aides employeur' as DottedName
	const engine = useEngine()
	const aides = engine.getRule(dottedName)
	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aideLink = reduceAST(
		(acc, node) => {
			if (node.sourceMap?.mecanismName === 'somme') {
				const aidesNotNul =
					(node.sourceMap?.args.valeur as ASTNode[])
						.map((n) => engine.evaluate(n))
						.filter(({ nodeValue }) => nodeValue !== false) ?? []
				if (aidesNotNul.length === 1 && 'dottedName' in aidesNotNul[0]) {
					return aidesNotNul[0].dottedName as DottedName
				} else {
					return acc
				}
			}
		},
		dottedName,
		aides
	)

	return (
		<Condition expression={`${dottedName} > 0`}>
			<StyledInfo>
				<FromTop>
					<RuleLink dottedName={aideLink}>
						<Trans>en incluant</Trans>{' '}
						<Value
							expression={dottedName}
							displayedUnit="€"
							unit={targetUnit}
						/>{' '}
						<Trans>d'aides</Trans> <Emoji emoji={aides.rawNode.icônes} />
					</RuleLink>
				</FromTop>
			</StyledInfo>
		</Condition>
	)
}

const StyledInfo = styled(SmallBody)`
	position: relative;
	text-align: right;
	margin-top: -1.5rem;
	margin-bottom: 1.5rem;
	right: 0;
	z-index: 3;
`
