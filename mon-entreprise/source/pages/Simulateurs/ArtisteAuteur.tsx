import { DistributionBranch } from 'Components/Distribution'
import Value, { Condition } from 'Components/EngineValue'
import SimulateurWarning from 'Components/SimulateurWarning'
import { SimulationGoal, SimulationGoals } from 'Components/SimulationGoals'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import urssafSrc from 'Images/Urssaf.svg'
import ircecSrc from 'Images/logos-caisses-retraite/ircec.jpg'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import config from './configs/artiste-auteur.yaml'

export default function ArtisteAuteur() {
	useSimulationConfig(config)

	return (
		<>
			<SimulateurWarning simulateur="artiste-auteur" />
			<SimulationGoals className="light">
				<SimulationGoal dottedName="artiste-auteur . revenus . traitements et salaires" />
				<SimulationGoal dottedName="artiste-auteur . revenus . BNC . recettes" />
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . revenus . BNC . micro-bnc"
					boolean
				/>
				<Warning dottedName="artiste-auteur . revenus . BNC . contrôle micro-bnc" />
				<Condition expression="artiste-auteur . revenus . BNC . micro-bnc = non">
					<SimulationGoal dottedName="artiste-auteur . revenus . BNC . frais réels" />
				</Condition>
				<SimulationGoal
					labelWithQuestion
					dottedName="artiste-auteur . cotisations . option surcotisation"
					boolean
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
			<CotisationsParOrganisme />
			<Condition expression="artiste-auteur . cotisations">
				<RepartitionCotisations />
			</Condition>
		</Animate.appear>
	)
}

function CotisationsParOrganisme() {
	return (
		<section>
			<h2>Vos institutions partenaires</h2>
			<div className="ui__ box-container">
				<div className="ui__  card box">
					<a target="_blank" href="https://www.urssaf.fr/portail/home.html">
						<LogoImg src={urssafSrc} title="logo Urssaf" />
					</a>
					<p className="ui__ notice">
						Les cotisations recouvrées par l'Urssaf, qui servent au financement
						de la sécurité sociale (assurance maladie, allocations familiales,
						dépendance)
					</p>
					<p className="ui__ lead">
						<Value
							displayedUnit="€"
							expression="artiste-auteur . cotisations"
						/>
					</p>
				</div>
				<div className="ui__  card box">
					<a target="_blank" href="http://www.ircec.fr/">
						<LogoImg src={ircecSrc} title="logo IRCEC" />
					</a>
					<p className="ui__ notice">
						Si vous êtes artiste-auteur professionnel et que vous êtes rémunéré
						en droits d’auteur, l’IRCEC est l’organisme de Sécurité sociale qui
						assure la gestion de votre retraite complémentaire obligatoire.
					</p>
					<p className="ui__ lead">
						<Value
							displayedUnit="€"
							expression="artiste-auteur . cotisations . IRCEC"
						/>
					</p>
				</div>
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
