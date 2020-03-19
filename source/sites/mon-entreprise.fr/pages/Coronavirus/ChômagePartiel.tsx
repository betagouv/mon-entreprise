import {
	EngineContext,
	Evaluation,
	Provider,
	useEvaluation
} from 'Engine/react'
import RuleInput from 'Engine/RuleInput'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import Animate from 'Ui/animate'

const extraRules = `
contrat salarié . rémunération . net . sans chômage partiel:
	formule:
		recalcul:
			règle: contrat salarié . rémunération . net
			avec:
				contrat salarié . chômage partiel: non

perte de revenu chômage partiel:
	formule:
		somme:
			- contrat salarié . rémunération . net
			- (- contrat salarié . rémunération . net . sans chômage partiel)
`

export default function Coronavirus() {
	return (
		<>
			<h1>Coronavirus et chômage partiel : quel impact sur mes revenus ?</h1>
			<p>
				Le gouvernement met en place des mesures de soutien aux salariés touchés
				par la crise du Coronavirus. Parmis les mesures phares, la prise en
				charge de l'intégralité de l'indemnisation du chômage partiel par
				l'état.
			</p>
			<SimulateurSalarié />
		</>
	)
}

function SimulateurSalarié() {
	const [situation, setSituation] = useState({
		'contrat salarié . chômage partiel': 'oui'
	})
	const result = !!situation['contrat salarié . rémunération . brut de base']
	return (
		<Provider situation={situation} extra={extraRules}>
			<section className="ui__ light card">
				<div id="targetSelection">
					<ul className="targets">
						<SimpleField
							dottedName={'contrat salarié . rémunération . brut de base'}
							onChange={value =>
								setSituation(state => ({
									...state,
									'contrat salarié . rémunération . brut de base': value
								}))
							}
						/>
						{/* <SimpleField
							dottedName={
								'contrat salarié . chômage partiel . heures chômées . proportion'
							}
							onChange={value =>
								setSituation(state => ({
									...state,
									'contrat salarié . chômage partiel . heures chômées . proportion': value
								}))
							}
						/> */}
					</ul>
				</div>
			</section>
			{result && (
				<Animate.fromTop>
					{' '}
					<div
						className="ui__ plain card"
						css={`
							margin-top: 2rem;
							padding: 0.5rem;
						`}
					>
						<h3>
							Revenu net avec chômage partiel :{' '}
							<Evaluation expression="contrat salarié . rémunération . net" />
						</h3>
						<ul>
							<li>
								Indemnité chômage partiel prise en charge par l'état :{' '}
								<Evaluation expression="contrat salarié . chômage partiel . indemnité d'activité partielle" />
							</li>
							<li>
								Total payé par l'entreprise :{' '}
								<Evaluation expression="contrat salarié . prix du travail" />
							</li>
							<li>
								Perte de revenu net :{' '}
								<Evaluation expression="perte de revenu chômage partiel" />
							</li>
						</ul>
					</div>
				</Animate.fromTop>
			)}
		</Provider>
	)
}

const SliderLegend = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 0.8em;
	line-height: 1.1em;

	span:last-child {
		text-align: right;
	}
`

function SimpleField({ dottedName, onChange }) {
	const rule = useEvaluation(dottedName)
	const { engine } = useContext(EngineContext)
	if (engine === null) {
		return null
	}

	const rules = engine.rules
	const situation = engine.situation

	return (
		<li>
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
						rules={rules}
						value={situation[dottedName]}
						onChange={onChange}
						useSwitch
					/>
				</div>
			</div>
		</li>
	)
}
