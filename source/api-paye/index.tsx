import { PaySlip2 } from 'Components/PaySlip'
import Engine from 'Engine'
import { safeDump, safeLoad } from 'js-yaml'
import React, { useState } from 'react'
import styled from 'styled-components'
import casTypes from './cas-types.yaml'

const defaultRules = safeDump(Object.values(casTypes)[0]) as string
const engine = new Engine.Engine()
const output = ['contrat salarié . maladie']

export default function APIPayeApp() {
	const [rules, setRules] = useState(defaultRules)
	const [segments, setSegments] = useState([])
	const [currentPayfit, setCurrentPayFit] = useState(0)

	function calculate() {
		const parsedRules = safeLoad(rules)
		let situationAcc = {}
		let cotisationsVerséesAcc = Array(1).fill(0)
		const baseSituation = parsedRules['contrat']
		setSegments(
			parsedRules['périodes'].map(
				({ période: { du, au }, ...situationModifier }, index) => {
					const situation = { ...baseSituation, ...situationModifier }
					situationAcc = { ...situationAcc }
					cotisationsVerséesAcc = [...cotisationsVerséesAcc]
					const cotisationsVerséesCeMois = engine.evaluate(output, {
						defaultUnits: [],
						situation
					})
					const analysis = engine.getLastEvaluationExplanations()
					Object.keys(situation).forEach(name => {
						situationAcc[name] = situation[name] + (situationAcc[name] ?? 0)
					})
					const q = index + 1 // durée depuis le début de l'année (ou le début du contrat si démarrage en cours d'année) en mois
					const situationTotaleParMois = Object.fromEntries(
						Object.entries(situationAcc).map(([a, b]) => [a, b / q])
					)
					cotisationsVerséesCeMois.forEach((cotis, index) => {
						cotisationsVerséesAcc[index] += cotis
					})
					const cotisationsDuesTotal = engine
						.evaluate(output, {
							defaultUnits: [],
							situation: situationTotaleParMois
						})
						.map(x => x * q)
					const regularisations = cotisationsDuesTotal.map(
						(x, index) => x - cotisationsVerséesAcc[index]
					)
					cotisationsVerséesCeMois.forEach((_, index) => {
						cotisationsVerséesAcc[index] += regularisations[index]
					})
					analysis.targets = [
						{
							...analysis.targets[0],
							nodeValue: analysis.targets[0].nodeValue + regularisations[0]
						}
					]
					return {
						periodLabel: `du ${du} au ${au}`,
						analysis
					}
				}
			)
		)
	}

	return (
		<APIPayeLayout>
			<div
				className="pane"
				css={`
					width: 40%;
				`}
			>
				<h1>API Paye</h1>
				<button className="ui__ button" onClick={calculate}>
					Calculer
				</button>
				<Editor value={rules} onChange={evt => setRules(evt.target.value)} />
				<select
					value="label"
					onChange={evt => setRules(safeDump(casTypes[evt.target.value]))}
				>
					<option value={'label'}>Choisir un cas type</option>
					{Object.keys(casTypes).map(casName => (
						<option key={casName}>{casName}</option>
					))}
				</select>
			</div>
			<div
				className="pane"
				css={`
					width: 60%;
				`}
			>
				{/* <select onChange={evt => setCurrentPayFit(Number(evt.target.value))}>
					{segments?.map(({ periodLabel }, index) => (
						<option value={index} key={periodLabel}>
							{periodLabel}
						</option>
					))}
				</select> */}
				{segments.map(({ periodLabel, analysis }) => (
					<>
						<h2>{periodLabel}</h2>
						<PaySlip2 analysis={analysis} />
					</>
				))}
			</div>
		</APIPayeLayout>
	)
}

const APIPayeLayout = styled.div`
	display: flex;
	height: 100%;

	h1 {
		text-align: center;
		margin-top: 0;
	}

	.pane {
		display: flex;
		flex-direction: column;
		padding: 20px;
	}

	.pane:first-child {
		border-right: 1px solid grey;
		background: lightgoldenrodyellow;
	}

	.payslip__container {
		overflow-y: scroll;
	}
`
const Editor = styled.textarea`
	font-family: monospace;
	width: 100%;
	flex-grow: 1;
	border: none;
	resize: none;
`
