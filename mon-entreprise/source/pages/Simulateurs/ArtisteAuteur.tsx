import { DistributionBranch } from 'Components/Distribution'
import Value, { Condition } from 'Components/EngineValue'
import SimulateurWarning from 'Components/SimulateurWarning'
import AidesCovid from 'Components/simulationExplanation/AidesCovid'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import config from './configs/artiste-auteur.yaml'

export default function ArtisteAuteur() {
	useSimulationConfig(config)

	return (
		<>
			<SimulateurWarning simulateur="artiste-auteur" />
			<SimulationGoals className="light">
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . revenus . traitements et salaires"
				/>
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . revenus . BNC . recettes"
				/>
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . revenus . BNC . micro-bnc"
				/>
				<Warning dottedName="artiste-auteur . revenus . BNC . contrôle micro-bnc" />
				<Condition expression="artiste-auteur . revenus . BNC . micro-bnc = non">
					<SimulationGoal
						labelWithQuestion
						dottedName="artiste-auteur . revenus . BNC . frais réels"
					/>
				</Condition>
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . cotisations . option surcotisation"
				/>
			</SimulationGoals>
			<CotisationsResult />
		</>
	)
}

type WarningProps = {
	dottedName: DottedName
}

function Warning({ dottedName }: WarningProps) {
	const description = useContext(EngineContext).getRule(dottedName).rawNode
		.description
	return (
		<Condition expression={dottedName}>
			<li>{description}</li>
		</Condition>
	)
}

const ResultLine = styled.div`
	padding: 10px;
	font-size: 1.25em;
	display: flexbox;
	flex-direction: column;
`

const ResultLabel = styled.div`
	flex-grow: 1;
`

function CotisationsResult() {
	const [display, setDisplay] = useState(false)
	const situation = useSelector(situationSelector)

	if (Object.keys(situation).length && !display) {
		setDisplay(true)
	}

	if (!display) {
		return null
	}

	return (
		<Animate.appear>
			<div
				className="ui__ card"
				css={`
					margin-top: 2rem;
				`}
			>
				<ResultLine>
					<ResultLabel>
						<Trans>Montant des cotisations</Trans>
					</ResultLabel>
					<Value
						displayedUnit="€"
						precision={0}
						expression="artiste-auteur . cotisations"
					/>
				</ResultLine>
			</div>
			<br />
			<AidesCovid aidesRule="artiste-auteur . réduction de cotisations covid 2020" />
			<Condition expression="artiste-auteur . cotisations">
				<RepartitionCotisations />
			</Condition>
		</Animate.appear>
	)
}

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS',
		icon: '🏛',
	},
	{
		dottedName: 'artiste-auteur . cotisations . formation professionnelle',
		icon: '👷‍♂️',
	},
] as const

function RepartitionCotisations() {
	const engine = useContext(EngineContext)
	const cotisations = branches.map((branch) => ({
		...branch,
		value: engine.evaluate(branch.dottedName).nodeValue as number,
	}))
	const maximum = Math.max(...cotisations.map((x) => x.value))
	return (
		<section>
			<h2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</h2>
			<div className="distribution-chart__container">
				{cotisations.map((cotisation) => (
					<DistributionBranch
						key={cotisation.dottedName}
						maximum={maximum}
						{...cotisation}
					/>
				))}
			</div>
		</section>
	)
}
