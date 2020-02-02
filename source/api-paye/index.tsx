import { PaySlip2 } from 'Components/PaySlip'
import Engine from 'Engine/index'
import { safeDump, safeLoad } from 'js-yaml'
import React, { useState } from 'react'
import styled from 'styled-components'
import casTypes from './cas-types.yaml'

const defaultRules = safeDump(Object.values(casTypes)[0]) as string
const engine = new Engine.Engine()
const output = [
	'contrat salarié . maladie',
	'contrat salarié . vieillesse',
	'contrat salarié . allocations familiales'
]

export default function APIPayeApp() {
	const [rules, setRules] = useState(defaultRules)
	const [segments, setSegments] = useState([])

	function calculate() {
		const parsedRules = safeLoad(rules)
		let situationAcc = {}
		let cotisationsVerséesAcc = Array(output.length).fill(0)
		const baseSituation = parsedRules['contrat']
		setSegments(
			parsedRules['périodes'].map(
				({ du, au, situation: situationModifier }, index) => {
					const situation = { ...baseSituation, ...situationModifier }
					situationAcc = { ...situationAcc }
					cotisationsVerséesAcc = [...cotisationsVerséesAcc]
					// Ce premier calcul semble redondant, il devrait être possible de
					// calculer les cotisation vérsées directement comme la régularisation
					// = cotisation dûes (sur l'année) - cotisation versées (sur l'année
					// jusqu'au mois précédent).
					const cotisationsVerséesCeMois = engine.evaluate(output, {
						defaultUnits: [],
						situation
					})
					const analysis = engine.getLastEvaluationExplanations()
					Object.keys(situation).forEach(name => {
						situationAcc[name] =
							typeof situation[name] === 'string'
								? situation[name]
								: situation[name] + (situationAcc[name] ?? 0)
					})
					const q = index + 1 // durée depuis le début de l'année (ou le début du contrat si démarrage en cours d'année) en mois
					cotisationsVerséesCeMois.forEach((cotis, index) => {
						cotisationsVerséesAcc[index] += cotis
					})
					const cotisationsDuesTotal = engine
						.evaluate(output, {
							defaultUnits: [],
							situation: Object.fromEntries(
								Object.entries(situationAcc).map(([a, b]) => [
									a,
									typeof b === 'number' ? b / q : b
								])
							)
						})
						.map(x => x && x * q)
					const regularisations = cotisationsDuesTotal.map(
						(x, index) => x && x - cotisationsVerséesAcc[index]
					)
					cotisationsVerséesCeMois.forEach((_, index) => {
						cotisationsVerséesAcc[index] += regularisations[index]
					})
					// console.log({
					// 	q,
					// 	situation,
					// 	situationAcc,
					// 	cotisationsVerséesCeMois,
					// 	cotisationsVerséesAcc,
					// 	regularisations
					// })
					if (analysis) {
						analysis.targets = analysis.targets.map((a, i) => ({
							...a,
							nodeValue: (a.nodeValue ?? 0) + (regularisations[i] ?? 0)
						}))
					}
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
