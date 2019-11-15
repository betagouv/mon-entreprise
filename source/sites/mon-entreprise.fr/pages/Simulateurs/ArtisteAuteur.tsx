import { updateSituation } from 'Actions/actions'
import { DistributionBranch } from 'Components/Distribution'
import RuleLink from 'Components/RuleLink'
import SimulateurWarning from 'Components/SimulateurWarning'
import config from 'Components/simulationConfigs/artiste-auteur.yaml'
import { useSimulationConfig } from 'Components/simulationConfigs/useSimulationConfig'
import 'Components/TargetSelection.css'
import { formatValue } from 'Engine/format'
import { getRuleFromAnalysis } from 'Engine/rules'
import { serialiseUnit } from 'Engine/units'
import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import {
	analysisWithDefaultsSelector,
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
	useSimulationConfig(config)
	const initialRender = useInitialRender()

	return (
		<>
			<h1>Estimer mes cotisations d’artiste-auteur</h1>
			<SimulateurWarning simulateur="artiste-auteur" />
			<section className="ui__ plain card">
				<div id="targetSelection">
					<ul className="targets">
						<SimpleField
							dottedName="dirigeant . artiste-auteur . revenus . traitements et salaires"
							initialRender={initialRender}
						/>
						<SimpleField
							dottedName="dirigeant . artiste-auteur . revenus . BNC . recettes"
							initialRender={initialRender}
						/>
						<SimpleField
							dottedName="dirigeant . artiste-auteur . revenus . BNC . régime spécial"
							initialRender={initialRender}
						/>
						<WarningRegimeSpecial />
						<SimpleField
							dottedName="dirigeant . artiste-auteur . revenus . BNC . frais réels"
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
	const situation = useSelector(situationSelector)
	const [value, setValue] = useState(situation[dottedName])
	if (!rule) {
		return null
	}

	const unit = serialiseUnit(rule.unit)
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
						{unit === '€' && (
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
						)}
						{/* Super hacky */}
						{unit !== '€' && (
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
	const recettes =
		situation['dirigeant . artiste-auteur . revenus . BNC . recettes']
	const showWarning = recettes !== 0 && recettes >= 70000
	return (
		showWarning && (
			<li>
				Vos revenus ne vous permettent pas d'opter pour le régime spécial.
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
	const cotisationRule = useRule('dirigeant . artiste-auteur . cotisations')
	const value = cotisationRule.nodeValue

	if (value && !display) {
		setDisplay(true)
	}

	return (
		display && (
			<Animate.appear>
				<ResultBlock className="ui__ card">
					<ResultLabel>Montant des cotisations</ResultLabel>
					<div>
						{cotisationRule.nodeValue ? (
							<RuleLink dottedName={cotisationRule.dottedName}>
								{formatValue({
									value: cotisationRule.nodeValue,
									language: 'fr',
									unit: '€',
									maximumFractionDigits: 0
								})}
							</RuleLink>
						) : (
							'-'
						)}
					</div>
				</ResultBlock>
				<RepartitionCotisations />
			</Animate.appear>
		)
	)
}

const branches = [
	{
		dottedName: 'dirigeant . artiste-auteur . cotisations . vieillesse',
		icon: '👵'
	},
	{
		dottedName: 'dirigeant . artiste-auteur . cotisations . CSG-CRDS',
		icon: '🏛'
	},
	{
		dottedName:
			'dirigeant . artiste-auteur . cotisations . formation profesionnelle',
		icon: '👷‍♂️'
	}
]

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
