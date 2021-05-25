import { DistributionBranch } from 'Components/Distribution'
import Value, { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import SimulateurWarning from 'Components/SimulateurWarning'
import Simulation from 'Components/Simulation'
import { CotisationsUrssaf } from 'Components/simulationExplanation/PLExplanation'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import 'Components/TargetSelection.css'
import { EngineContext, useEngine } from 'Components/utils/EngineContext'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import ircecSrc from 'Images/logos-caisses-retraite/ircec.jpg'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import config from './configs/artiste-auteur.yaml'

export default function ArtisteAuteur() {
	useSimulationConfig(config)

	return (
		<>
			<SimulateurWarning simulateur="artiste-auteur" />
			<Simulation explanations={<CotisationsResult />}>
				<PeriodSwitch />

				<SimulationGoals className="plain">
					<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}
function CotisationsResult() {
	return (
		<>
			<CotisationsParOrganisme />
			<Condition expression="artiste-auteur . cotisations > 0">
				<RepartitionCotisations />
			</Condition>
		</>
	)
}

function CotisationsParOrganisme() {
	const cotisIRCEC = useEngine().evaluate(
		'artiste-auteur . cotisations . IRCEC'
	)
	const { description: descriptionIRCEC } = useEngine().getRule(
		'artiste-auteur . cotisations . IRCEC'
	).rawNode
	return (
		<section>
			<h2>Vos institutions partenaires</h2>
			<div className="ui__ box-container">
				<CotisationsUrssaf rule="artiste-auteur . cotisations" />
				{cotisIRCEC.nodeValue ? (
					<div className="ui__  card box">
						<a target="_blank" href="http://www.ircec.fr/">
							<LogoImg src={ircecSrc} title="logo IRCEC" />
						</a>
						<p className="ui__ notice">{descriptionIRCEC}</p>
						<p className="ui__ lead">
							<Value
								displayedUnit="€"
								expression="artiste-auteur . cotisations . IRCEC"
							/>
						</p>
					</div>
				) : null}
			</div>
		</section>
	)
}

const LogoImg = styled.img`
	padding: 1rem;
	height: 5rem;
`

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵',
	},
	{
		dottedName: 'artiste-auteur . cotisations . IRCEC',
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
				{cotisations
					.filter(({ value }) => Boolean(value))
					.map((cotisation) => (
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
