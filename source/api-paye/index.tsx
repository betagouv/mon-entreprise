import PaySlip from 'Components/PaySlip'
import { safeDump, safeLoad } from 'js-yaml'
import React, { useState } from 'react'
import styled from 'styled-components'
import casTypes from './cas-types.yaml'

const defaultRules = `
- période:
    du: 01/01/2020
    au: 31/01/2020
  contrat salarié . rémunération . brut de base: 1500€

- période:
    du: 01/02/2020
    au: 28/02/2020
  contrat salarié . rémunération . brut de base: 2500€

- période:
    du: 01/03/2020
    au: 31/03/2020
  contrat salarié . rémunération . brut de base: 1500€
`

export default function APIPayeApp() {
	const [rules, setRules] = useState(defaultRules)
	const [periods, setPeriods] = useState<string[]>([])

	function calculate() {
		const parsedRules = safeLoad(rules)
		const buildPeriods: string[] = []
		parsedRules.forEach(({ période: { du, au } }) => {
			buildPeriods.push(`du ${du} au ${au}`)
		})
		setPeriods(buildPeriods)
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
				<select>
					{periods.map(period => (
						<option key={period}>{period}</option>
					))}
				</select>

				{periods.length !== 0 && <PaySlip />}
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
