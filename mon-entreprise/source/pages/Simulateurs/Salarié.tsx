import Banner from 'Components/Banner'
import Value, { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import Simulation from 'Components/Simulation'
import SalaryExplanation from 'Components/simulationExplanation/SalaryExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import { FromTop } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { useEngine } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { Link } from 'DesignSystem/typography/link'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import { Names } from 'modele-social/dist/names'
import { reduceAST } from 'publicodes'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'

const ButtonContainer = styled.div`
	margin: 2rem 1rem;
`

export default function SalariéSimulation() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<Simulation
				explanations={<SalaryExplanation />}
				customEndMessages={
					<Body>
						<Trans i18nKey="simulation-end.hiring.text">
							Vous pouvez maintenant concrétiser votre projet d'embauche.
						</Trans>
						<ButtonContainer>
							<Button to={sitePaths.gérer.embaucher}>
								<Trans i18nKey="simulation-end.cta">
									Connaître les démarches
								</Trans>
							</Button>
						</ButtonContainer>
					</Body>
				}
			>
				<SalariéSimulationGoals />
				{/** L'équipe Code Du Travail Numérique ne souhaite pas référencer
				 * le simulateur dirigeant de SASU sur son site. */}
				{!document.referrer?.includes('code.travail.gouv.fr') && (
					<Banner icon={'👨‍✈️'}>
						<Trans>
							Vous êtes dirigeant d'une SAS(U) ?{' '}
							<Link to={sitePaths.simulateurs.sasu}>
								Accéder au simulateur de revenu dédié
							</Link>
						</Trans>
					</Banner>
				)}
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
	const dottedName = 'contrat salarié . aides employeur' as Names
	const engine = useEngine()
	const aides = engine.getRule(dottedName)
	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aideLink = reduceAST(
		(acc, node) => {
			if (node.nodeKind === 'somme') {
				const aidesNotNul = node.explanation
					.map((n) => engine.evaluate(n))
					.filter(({ nodeValue }) => nodeValue !== false)
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
