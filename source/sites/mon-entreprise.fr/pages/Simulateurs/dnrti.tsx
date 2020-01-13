import { setSimulationConfig, updateSituation } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import { formatValue } from 'Engine/format'
import InputComponent from 'Engine/InputComponent'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector,
	nextStepsSelector,
	ruleAnalysisSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { DottedName, Rule } from 'Types/rule'
import Animate from 'Ui/animate'
import { CompanySection } from '../Gérer/Home'
import { useRule } from './ArtisteAuteur'

const simulationConfig = {
	objectifs: [
		'dirigeant . indépendant . cotisations et contributions',
		'dirigeant . rémunération totale'
	],
	situation: {
		dirigeant: 'indépendant'
	},
	'unités par défaut': ['€/an']
}

export default function DNRTI() {
	const dispatch = useDispatch()
	const analysis = useSelector(analysisWithDefaultsSelector)
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	dispatch(setSimulationConfig(simulationConfig, true))

	return (
		<>
			<h1>
				Aide à la déclaration de revenus{' '}
				<img src="https://img.shields.io/badge/-beta-blue" />
				<br />
				<small>Travailleurs indépendants</small>
			</h1>
			<p>
				Cette outil vous permet de calculer les données à saisir dans votre
				déclaration de revenus professionnels.
			</p>
			<FormWrapper>
				<FormBlock>
					<CompanySection company={company} />
					<h2>Revenus d'activité</h2>
					<SimpleField
						dottedName="dirigeant . rémunération totale"
						question="Quel est votre résultat fiscal ?"
					/>
					<SimpleField dottedName="entreprise . date de création" />

					<SubSection dottedName="entreprise . catégorie d'activité" />
					{/* PLNR */}
					<SimpleField dottedName="dirigeant . indépendant . PLNR régime général" />
					<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux spécifique PLNR" />
					<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . déduction tabac" />

					<h3>Situation personnelle</h3>
					<SimpleField dottedName="situation personnelle . RSA" />
					<SubSection dottedName="situation personnelle . IJSS" />
					<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

					<h3>Exonérations</h3>
					<SimpleField dottedName="entreprise . ACRE" />
					<SimpleField dottedName="établissement . ZFU" />
					<SubSection
						dottedName="dirigeant . indépendant . cotisations et contributions . exonérations"
						sectionTitle={false}
					/>

					<h3>International</h3>
					<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
					<SubSection
						dottedName="dirigeant . indépendant . revenus étrangers"
						sectionTitle={false}
					/>
					{/* <h3>DOM - Départements d'Outre-Mer</h3>
						<p>
							<em>Pas encore implémenté</em>
						</p> */}
				</FormBlock>
				<Results />
			</FormWrapper>
		</>
	)
}

function SubSection({ dottedName: sectionDottedName, sectionTitle }) {
	const flatRules = useSelector(flatRulesSelector)
	const title = sectionTitle ?? useRule(sectionDottedName)?.title
	const nextSteps = useSelector(nextStepsSelector)
	const situation = useSelector(situationSelector)

	const subQuestions = flatRules
		.filter(
			({ dottedName, question }) =>
				Boolean(question) &&
				dottedName.startsWith(sectionDottedName) &&
				(Object.keys(situation).includes(dottedName) ||
					nextSteps.includes(dottedName))
		)
		.sort(
			(rule1, rule2) =>
				nextSteps.indexOf(rule1.dottedName) -
				nextSteps.indexOf(rule2.dottedName)
		)
	return (
		<>
			{!!subQuestions.length && title && <h3>{title}</h3>}
			{subQuestions.map(({ dottedName }) => (
				<SimpleField key={dottedName} dottedName={dottedName} />
			))}
		</>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
	question?: Rule['question']
}
function SimpleField({ dottedName, question }: SimpleFieldProps) {
	const dispatch = useDispatch()
	const analysis = useSelector((state: RootState) => {
		return ruleAnalysisSelector(state, { dottedName })
	})
	const rules = useSelector((state: RootState) => state.rules)
	const value = useSelector(situationSelector)[dottedName]
	const [currentValue, setCurrentValue] = useState(value)
	const update = (value: unknown) => {
		dispatch(updateSituation(dottedName, value))
		dispatch({
			type: 'STEP_ACTION',
			name: 'fold',
			step: dottedName
		})
		setCurrentValue(value)
	}
	useEffect(() => {
		setCurrentValue(value)
	}, [value])

	if (!analysis.isApplicable) {
		return null
	}
	return (
		<Animate.fromTop>
			<Question>
				<p
					css={`
						border-left: 4px solid var(--lightColor);
						border-radius: 3px;
						padding-left: 12px;
						margin-left: -12px;
					`}
				>
					{question ?? analysis.question}
				</p>
				<InputComponent
					rules={rules}
					dottedName={dottedName}
					onChange={update}
					value={currentValue}
				/>
				{/* <Field dottedName={dottedName} onChange={onChange} /> */}
			</Question>
		</Animate.fromTop>
	)
}

function Results() {
	const cotisationsRule = useRule(
		'dirigeant . indépendant . cotisations et contributions'
	)
	const revenusNet = useRule(
		'dirigeant . indépendant . revenu net de cotisations'
	)
	const nonDeductible = useRule(
		'dirigeant . indépendant . cotisations et contributions . CSG et CRDS'
	)

	function Link({ cotisation }) {
		return (
			<p className="ui__ lead">
				<RuleLink dottedName={cotisation.dottedName}>
					{cotisation.nodeValue
						? formatValue({
								value: cotisation.nodeValue,
								language: 'fr',
								unit: '€',
								maximumFractionDigits: 0
						  })
						: '-'}
				</RuleLink>
			</p>
		)
	}
	if (!cotisationsRule.nodeValue) {
		return null
	}
	return (
		<ResultBlock>
			<Animate.fromTop>
				<ResultSubTitle>Vos cotisations</ResultSubTitle>
				<Link cotisation={cotisationsRule} />
				<ResultSubTitle>Vos revenus net</ResultSubTitle>
				<Link cotisation={revenusNet} />
				<ResultSubTitle>Cotisations non déductibles</ResultSubTitle>
				<p className="ui__ notice">
					Ce montant doit être réintégré au revenu net dans votre déclaration
					fiscale.
				</p>
				<Link cotisation={nonDeductible} />
			</Animate.fromTop>
		</ResultBlock>
	)
}

const FormWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	ul {
		padding: 0;
	}
`

const FormBlock = styled.section`
	width: 63%;
	padding: 0;

	h3 {
		margin-top: 50px;
	}

	select,
	input[type='text'] {
		font-size: 1.05em;
		padding: 5px 10px;
	}
`

const Question = styled.div`
	margin-top: 1em;
`

const ResultBlock = styled.section`
	position: sticky;
	top: 3%;
	padding: 3%;
	width: 34%;
	background: var(--lightestColor);
`

const ResultSubTitle = styled.h4`
	&:not(:first-child) {
		margin-top: 2em;
	}
`

const ResultNumber = styled.strong`
	display: block;
	text-align: right;
`
