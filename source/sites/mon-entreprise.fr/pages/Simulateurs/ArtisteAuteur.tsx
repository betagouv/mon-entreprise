import { setSimulationConfig, updateSituation } from 'Actions/actions'
import { DistributionBranch } from 'Components/Distribution'
import RuleLink from 'Components/RuleLink'
import SimulateurWarning from 'Components/SimulateurWarning'
import config from 'Components/simulationConfigs/artiste-auteur.yaml'
import 'Components/TargetSelection.css'
import { formatValue } from 'Engine/format'
import { getRuleFromAnalysis } from 'Engine/rules'
import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	ruleAnalysisSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { DottedName } from 'Types/rule'
import Animate from 'Ui/animate'
import ToggleSwitch from 'Ui/ToggleSwitch'

export function useRule(dottedName: DottedName) {
	const analysis = useSelector(analysisWithDefaultsSelector)
	const getRule = getRuleFromAnalysis(analysis)
	return getRule(dottedName)
}

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

	return (
		<>
			<h1>Estimer mes cotisations d’artiste-auteur</h1>
			<SimulateurWarning simulateur="artiste-auteur" />
			<section className="ui__ plain card">
				<div id="targetSelection">
					<ul className="targets">
						<SimpleField
							dottedName="artiste-auteur . revenus . traitements et salaires"
							initialRender={initialRender}
						/>
						<SimpleField
							dottedName="artiste-auteur . revenus . BNC . recettes"
							initialRender={initialRender}
						/>
						<SimpleField
							dottedName="artiste-auteur . revenus . BNC . micro-bnc"
							initialRender={initialRender}
						/>
						<WarningRegimeSpecial />
						<SimpleField
							dottedName="artiste-auteur . revenus . BNC . frais réels"
							initialRender={initialRender}
						/>
						<SimpleField
							dottedName="artiste-auteur . cotisations . option surcotisation"
							initialRender={initialRender}
						/>
					</ul>
				</div>
			</section>
			<CotisationsResult />
		</>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
	initialRender: boolean
}

function SimpleField({ dottedName, initialRender }: SimpleFieldProps) {
	const rule = useRule(dottedName)
	const dispatch = useDispatch()
	const analysis = useSelector((state: RootState) =>
		ruleAnalysisSelector(state, { dottedName })
	)
	const situation = useSelector(situationSelector)
	const [value, setValue] = useState(situation[dottedName])

	if (!analysis.isApplicable) {
		return null
	}

	return (
		<li>
			<Animate.appear unless={initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={`step-${dottedName}`}>
							<span className="optionTitle">{rule.question}</span>
							<p>{rule.résumé}</p>
						</label>
					</div>
					<div className="targetInputOrValue">
						{/* Super hacky */}
						{analysis.unit !== undefined ? (
							<NumberFormat
								autoFocus
								id={'step-' + dottedName}
								thousandSeparator={' '}
								suffix=" €"
								allowEmptyFormatting={true}
								onValueChange={({ floatValue }) => {
									setValue(floatValue)
									dispatch(updateSituation(dottedName, floatValue || 0))
								}}
								value={value}
								autoComplete="off"
								className="targetInput"
								css={`
									color: white;
									border-color: white;
									padding: 10px;
								`}
							/>
						) : (
							<ToggleSwitch
								id={`step-${dottedName}`}
								defaultChecked={rule.nodeValue}
								onChange={evt =>
									dispatch(
										updateSituation(dottedName, evt.currentTarget.checked)
									)
								}
							/>
						)}
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
	return (
		showWarning && (
			<li>
				Vos revenus ne vous permettent pas d'opter pour le régime micro-BNC.
			</li>
		)
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
	const cotisationRule = useRule('artiste-auteur . cotisations')
	const value = cotisationRule.nodeValue

	if (value && !display) {
		setDisplay(true)
	}

	return (
		display && (
			<Animate.appear>
				<ResultBlock className="ui__ card">
					<ResultLabel>Montant des cotisations</ResultLabel>
					<RuleLink dottedName={cotisationRule.dottedName}>
						{formatValue({
							value: cotisationRule.nodeValue,
							language: 'fr',
							unit: '€',
							maximumFractionDigits: 0
						})}
					</RuleLink>
				</ResultBlock>
				{cotisationRule.nodeValue ? <RepartitionCotisations /> : null}
			</Animate.appear>
		)
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
			<h2>À quoi servent mes cotisations ?</h2>
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
