import { setSimulationConfig, updateSituation } from 'Actions/actions'
import { DistributionBranch } from 'Components/Distribution'
import RuleLink from 'Components/RuleLink'
import SimulateurWarning from 'Components/SimulateurWarning'
import config from 'Components/simulationConfigs/artiste-auteur.yaml'
import 'Components/TargetSelection.css'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { formatValue } from 'Engine/format'
import RuleInput from 'Engine/RuleInput'
import { getRuleFromAnalysis } from 'Engine/ruleUtils'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	parsedRulesSelector,
	ruleAnalysisSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { DottedName } from 'Types/rule'
import Animate from 'Ui/animate'

export function useRule(dottedName: DottedName) {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	return getRule(dottedName)
}

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
	dispatch(setSimulationConfig(config))
	const initialRender = useInitialRender()
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
			<section className="ui__ light card">
				<div id="targetSelection">
					<ul className="targets">
						<InitialRenderContext.Provider value={initialRender}>
							<SimpleField dottedName="artiste-auteur . revenus . traitements et salaires" />
							<SimpleField dottedName="artiste-auteur . revenus . BNC . recettes" />
							<SimpleField dottedName="artiste-auteur . revenus . BNC . micro-bnc" />
							<WarningRegimeSpecial />
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
	const rule = useSelector(parsedRulesSelector)[dottedName]
	const dispatch = useDispatch()
	const analysis = useSelector((state: RootState) => {
		return ruleAnalysisSelector(state, { dottedName })
	})
	const initialRender = useContext(InitialRenderContext)
	const parsedRules = useSelector(parsedRulesSelector)
	const value = useSelector(situationSelector)[dottedName]

	const onChange = x => dispatch(updateSituation(dottedName, x))

	if (!analysis.isApplicable) {
		return null
	}

	return (
		<li>
			<Animate.appear unless={initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={`step-${dottedName}`}>
							<span className="optionTitle">{rule.question || rule.titre}</span>
							<p>{rule.résumé}</p>
						</label>
					</div>
					<div className="targetInputOrValue">
						<RuleInput
							className="targetInput"
							isTarget
							dottedName={dottedName}
							rules={parsedRules}
							value={value}
							onChange={onChange}
							useSwitch
						/>
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}

function WarningRegimeSpecial() {
	const situation = useSelector(situationSelector)
	const recettes = situation['artiste-auteur . revenus . BNC . recettes']
	const showWarning = recettes !== 0 && recettes >= 70000
	if (!showWarning) {
		return null
	}
	return (
		<li>
			Vos revenus ne vous permettent pas d'opter pour le régime micro-BNC.
		</li>
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
	const { i18n } = useTranslation()
	const situation = useSelector(situationSelector)
	const cotisationRule = useRule('artiste-auteur . cotisations')
	const value = cotisationRule.nodeValue

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
				<RuleLink dottedName={cotisationRule.dottedName}>
					{formatValue({
						value: cotisationRule.nodeValue,
						language: i18n.language,
						unit: '€',
						maximumFractionDigits: 0
					})}
				</RuleLink>
			</ResultBlock>
			{cotisationRule.nodeValue ? <RepartitionCotisations /> : null}
		</Animate.appear>
	)
}

const branches = [
	{
		dottedName: 'artiste-auteur . cotisations . vieillesse',
		icon: '👵'
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS . CSG',
		icon: '🏛'
	},
	{
		dottedName: 'artiste-auteur . cotisations . CSG-CRDS . CRDS',
		icon: '🏛'
	},
	{
		dottedName: 'artiste-auteur . cotisations . formation professionnelle',
		icon: '👷‍♂️'
	}
] as const

function RepartitionCotisations() {
	const cotisations = branches.map(branch => ({
		...branch,
		value: useRule(branch.dottedName).nodeValue as number
	}))
	const maximum = Math.max(...cotisations.map(x => x.value))
	const total = cotisations.map(x => x.value).reduce((a = 0, b) => a + b)
	return (
		<section>
			<h2>
				<Trans>À quoi servent mes cotisations ?</Trans>
			</h2>
			<div className="distribution-chart__container">
				{cotisations.map(cotisation => (
					<DistributionBranch
						key={cotisation.dottedName}
						distribution={{ maximum, total }}
						{...cotisation}
					/>
				))}
			</div>
		</section>
	)
}
