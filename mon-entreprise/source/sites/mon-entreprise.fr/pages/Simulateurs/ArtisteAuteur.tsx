import { DistributionBranch } from 'Components/Distribution'
import Value, { Condition } from 'Components/EngineValue'
import SimulateurWarning from 'Components/SimulateurWarning'
import config from 'Components/simulationConfigs/artiste-auteur.yaml'
import { SimulatorSection, Field, Warning } from 'Components/SimulatorInput'
import Animate from 'Components/ui/animate'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { EngineContext, useEvaluation } from 'Components/utils/EngineContext'
import React, { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'

export default function ArtisteAuteur() {
	const inIframe = useContext(IsEmbeddedContext)

	return (
		<>
			{!inIframe && (
				<h1>
					<Trans i18nKey="simulateurs.artiste-auteur.titre">
						Estimer mes cotisations d’artiste-auteur
					</Trans>
				</h1>
			)}
			<SimulateurWarning simulateur="artiste-auteur" />
			<SimulatorSection config={config}>
				<Field dottedName="artiste-auteur . revenus . traitements et salaires" />
				<Field dottedName="artiste-auteur . revenus . BNC . recettes" />
				<Field dottedName="artiste-auteur . revenus . BNC . micro-bnc" />
				<Warning dottedName="artiste-auteur . revenus . BNC . micro-bnc . contrôle micro-bnc" />
				<Field dottedName="artiste-auteur . revenus . BNC . frais réels" />
				<Field dottedName="artiste-auteur . cotisations . option surcotisation" />
			</SimulatorSection>
			<CotisationsResult />
		</>
	)
}

const ResultBlock = styled.div`
	margin-top: 30px;
	padding: 10px;
	background: #eee;
	font-size: 1.25em;
	background: #eee;
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
			<ResultBlock className="ui__ card">
				<ResultLabel>
					<Trans>Montant des cotisations</Trans>
				</ResultLabel>
				<Value
					displayedUnit="€"
					precision={0}
					expression="artiste-auteur . cotisations"
				/>
			</ResultBlock>
			<Condition expression="artiste-auteur . cotisations">
				<RepartitionCotisations />
			</Condition>
		</Animate.appear>
	)
}

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵'
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS',
		icon: '🏛'
	},
	{
		dottedName: 'artiste-auteur . cotisations . formation professionnelle',
		icon: '👷‍♂️'
	}
] as const

function RepartitionCotisations() {
	const engine = useContext(EngineContext)
	const cotisations = branches.map(branch => ({
		...branch,
		value: engine.evaluate(branch.dottedName).nodeValue as number
	}))
	const maximum = Math.max(...cotisations.map(x => x.value))
	return (
		<section>
			<h2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</h2>
			<div className="distribution-chart__container">
				{cotisations.map(cotisation => (
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
