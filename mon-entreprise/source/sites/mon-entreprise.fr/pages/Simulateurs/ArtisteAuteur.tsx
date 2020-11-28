import { setSimulationConfig, updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import { DistributionBranch } from 'Components/Distribution'
import Value, { Condition } from 'Components/EngineValue'
import SimulateurWarning from 'Components/SimulateurWarning'
import AidesCovid from 'Components/simulationExplanation/AidesCovid'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import { EngineContext, useEvaluation } from 'Components/utils/EngineContext'
import { createContext, useContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'Rules'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import config from './configs/artiste-auteur.yaml'

const InitialRenderContext = createContext(false)
function useInitialRender() {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])
	return initialRender
}

export default function ArtisteAuteur() {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [])
	const initialRender = useInitialRender()

	return (
		<>
			<SimulateurWarning simulateur="artiste-auteur" />
			<section className="ui__ light card">
				<div id="targetSelection">
					<ul className="targets">
						<InitialRenderContext.Provider value={initialRender}>
							<SimpleField dottedName="artiste-auteur . revenus . traitements et salaires" />
							<SimpleField dottedName="artiste-auteur . revenus . BNC . recettes" />
							<SimpleField dottedName="artiste-auteur . revenus . BNC . micro-bnc" />
							<Warning dottedName="artiste-auteur . revenus . BNC . micro-bnc . contrôle micro-bnc" />
							<SimpleField dottedName="artiste-auteur . revenus . BNC . frais réels" />
							<SimpleField dottedName="artiste-auteur . cotisations . option surcotisation" />
						</InitialRenderContext.Provider>
					</ul>
				</div>
			</section>
			<CotisationsResult />
		</>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
}

function SimpleField({ dottedName }: SimpleFieldProps) {
	const dispatch = useDispatch()
	const rule = useEvaluation(dottedName)
	const initialRender = useContext(InitialRenderContext)
	const parsedRules = useContext(EngineContext).getParsedRules()
	const value = useSelector(situationSelector)[dottedName]
	if (rule.isApplicable === false || rule.isApplicable === null) {
		return null
	}

	return (
		<li>
			<Animate.appear unless={initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={dottedName}>
							<span className="optionTitle">{rule.question || rule.titre}</span>
							<p className="ui__ notice">{rule.résumé}</p>
						</label>
					</div>
					<div className="targetInputOrValue">
						<RuleInput
							className="targetInput"
							isTarget
							dottedName={dottedName}
							rules={parsedRules}
							value={value}
							onChange={x => dispatch(updateSituation(dottedName, x))}
							useSwitch
						/>
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}

type WarningProps = {
	dottedName: DottedName
}

function Warning({ dottedName }: WarningProps) {
	const warning = useEvaluation(dottedName)
	if (!warning.nodeValue) {
		return null
	}
	return <li>{warning.description}</li>
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
