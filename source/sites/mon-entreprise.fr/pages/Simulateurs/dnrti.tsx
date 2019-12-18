import { setSimulationConfig, updateSituation } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import { Field } from 'Engine/field'
import { formatValue } from 'Engine/format'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector,
	ruleAnalysisSelector
} from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { DottedName, Rule } from 'Types/rule'
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
	dispatch(setSimulationConfig(simulationConfig))

	return (
		<>
			<h1>
				Aide à la déclaration de revenus{' '}
				<img src="https://img.shields.io/badge/-beta-blue" />
			</h1>
			<FormWrapper>
				<FormBlock>
					<p>
						Cette outil vous permet de calculer les données à saisir dans votre
						déclaration de revenus professionnels.
					</p>
					<h3>Revenus d'activité</h3>
					<SimpleField
						dottedName="dirigeant . rémunération totale"
						question="Quel est votre résultat fiscal ?"
					/>
					<SimpleField dottedName="entreprise . catégorie d'activité" />
					<SimpleField dottedName="entreprise . date de création" />

					<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />
					<h3>ACRE - Aide à la Création et la Reprise d'Entreprise</h3>
					<SimpleField dottedName="entreprise . ACRE" />
					<h3>ZFU - Zone Franche Urbaine</h3>
					<h3>Professions Libérales non réglementées</h3>
					<h3>Exonération age</h3>
					<SubSection dottedName="entreprise . catégorie d'activité . débit de tabac" />
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

function SubSection({ dottedName: sectionDottedName }) {
	const flatRules = useSelector(flatRulesSelector)
	const sectionTitle = useRule(sectionDottedName).title
	const subQuestions = flatRules.filter(
		({ dottedName, question }) =>
			Boolean(question) && dottedName.startsWith(sectionDottedName)
	)
	return (
		<>
			<h3>{sectionTitle}</h3>
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
	const update = (x: unknown) => {
		dispatch(updateSituation(dottedName, x))
	}
	const onChange = useCallback(update, [])

	if (!analysis.isApplicable) {
		return null
	}

	return (
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
			<Field dottedName={dottedName} onChange={onChange} />
		</Question>
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
			<ResultNumber>
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
			</ResultNumber>
		)
	}

	return (
		<ResultBlock>
			<ResultSubTitle>Vos cotisations</ResultSubTitle>
			<Link cotisation={cotisationsRule} />
			<ResultSubTitle>Vos revenus net</ResultSubTitle>
			<Link cotisation={revenusNet} />
			<ResultSubTitle>Cotisations non déductibles</ResultSubTitle>
			<Modalités>
				Ce montant doit être réintégré au revenu net dans votre déclaration
				fiscale.
			</Modalités>
			<Link cotisation={nonDeductible} />
		</ResultBlock>
	)
}

const FormWrapper = styled.div`
	margin-top: 40px;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
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

const Modalités = styled.p`
	font-size: 0.8em;
	font-family: 'Montserrat', sans-serif;
	color: grey;
	line-height: 1.2em;
`

const ResultSubTitle = styled.h4`
	font-size: 0.9em;
	font-weight: normal;

	&:not(:first-child) {
		margin-top: 2em;
	}
`

const ResultNumber = styled.strong`
	display: block;
	font-size: 1em;
`
