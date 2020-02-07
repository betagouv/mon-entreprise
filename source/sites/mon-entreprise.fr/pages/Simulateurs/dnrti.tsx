import { setSimulationConfig, updateSituation } from 'Actions/actions'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { formatValue } from 'Engine/format'
import InputComponent from 'Engine/RuleInput'
import React, { useCallback, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
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
		'aide déclaration revenu indépendant 2019 . revenu net fiscal',
		'aide déclaration revenu indépendant 2019 . CSG déductible',
		'aide déclaration revenu indépendant 2019 . cotisations sociales déductible',
		'aide déclaration revenu indépendant 2019 . total charges sociales déductible',
		'aide déclaration revenu indépendant 2019 . assiette sociale'
	],
	situation: {
		dirigeant: 'indépendant',
		'aide déclaration revenu indépendant 2019': 'oui'
	},
	'unités par défaut': ['€/an']
}
const lauchComputationWhenResultsInViewport = () => {
	const [resultsRef, resultsInViewPort] = useDisplayOnIntersecting({
		threshold: 0,
		unobserve: false
	})
	const [currentIncome, setCurrentIncome] = useState(null)
	const [displayForm, setDisplayForm] = useState(false)
	const updateIncome = useCallback(
		income => {
			setDisplayForm(income != null)
			setCurrentIncome(income)
		},
		[setDisplayForm, setCurrentIncome]
	)
	const dispatch = useDispatch()
	useEffect(() => {
		if (resultsInViewPort && displayForm) {
			dispatch(
				updateSituation('dirigeant . rémunération totale', currentIncome)
			)
		} else {
			dispatch(updateSituation('dirigeant . rémunération totale', null))
		}
	}, [resultsInViewPort, displayForm, currentIncome])

	return { updateIncome, resultsRef, displayForm }
}

export default function DNRTI() {
	const dispatch = useDispatch()
	const analysis = useSelector(analysisWithDefaultsSelector)
	const rules = useSelector(flatRulesSelector)
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	dispatch(setSimulationConfig(simulationConfig, true))
	const {
		resultsRef,
		displayForm,
		updateIncome
	} = lauchComputationWhenResultsInViewport()
	return (
		<>
			<h1>
				Aide à la déclaration de revenus au titre de l'année 2019{' '}
				<img src="https://img.shields.io/badge/-beta-blue" />
				<br />
				<small>Travailleurs indépendants</small>
			</h1>
			<p>
				Nous mettons à disposition un outil d'aide aux déclarations fiscale
				(revenu) et sociale (DSI). Il vous permet de connaître le montant des
				charges sociales déductibles à partir de votre résultat net fiscal.
			</p>
			<p>
				Cet outil vous concerne <strong>uniquement</strong> si vous êtes dans
				les cas suivants :
			</p>
			<ul>
				<li>vous cotisez au régime général des travailleurs indépendants</li>
				<li>
					votre entreprise est au régime réel d'imposition et en comptabilité
					d'engagement
				</li>
			</ul>
			<h2>Quel est votre revenu professionnel en 2019 ?</h2>
			<p>
				Indiquez votre résultat net fiscal avant déduction des charges sociales
				et exonérations fiscales.
			</p>
			<BigInput>
				<InputComponent
					rules={rules}
					dottedName="dirigeant . rémunération totale"
					onChange={updateIncome}
					autoFocus
				/>
			</BigInput>
			{displayForm && (
				<>
					<Animate.fromTop>
						<h3>Votre entreprise</h3>
						<p>
							Vous pouvez renseigner votre entreprise pour pré-remplir le
							formulaire
						</p>
						<CompanySection company={company} />

						<FormBlock>
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
								hideTitle
							/>

							<h3>International</h3>
							<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
							<SubSection
								dottedName="dirigeant . indépendant . revenus étrangers"
								hideTitle
							/>
						</FormBlock>
					</Animate.fromTop>
					<div ref={resultsRef}>
						<Results />
					</div>
				</>
			)}
		</>
	)
}

type SubSectionProp = {
	dottedName: DottedName
	hideTitle?: boolean
}
function SubSection({
	dottedName: sectionDottedName,
	hideTitle = false
}: SubSectionProp) {
	const flatRules = useSelector(flatRulesSelector)
	const ruleTitle = useRule(sectionDottedName)?.title
	const nextSteps = useSelector(nextStepsSelector)
	const situation = useSelector(situationSelector)
	const title = hideTitle ? null : ruleTitle

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
	summary?: Rule['summary']
	question?: Rule['question']
}
function SimpleField({ dottedName, question, summary }: SimpleFieldProps) {
	const dispatch = useDispatch()
	const analysis = useSelector((state: RootState) => {
		return ruleAnalysisSelector(state, { dottedName })
	})
	const rules = useSelector((state: RootState) => state.rules)
	const value = useSelector(situationSelector)[dottedName]
	const [currentValue, setCurrentValue] = useState(value)
	const dispatchValue = useCallback(
		value => {
			dispatch(updateSituation(dottedName, value))
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: dottedName
			})
		},
		[dispatch, dottedName]
	)
	const update = (value: unknown) => {
		dispatchValue(value)
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
				<div
					css={`
						border-left: 3px solid var(--lightColor);
						padding-left: 12px;
						margin-left: -15px;
					`}
				>
					<p>{question ?? analysis.question}</p>
					<p className="ui__ notice">{summary ?? analysis.summary}</p>
				</div>
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
	const results = simulationConfig.objectifs.map(dottedName =>
		useSelector((state: RootState) => {
			return ruleAnalysisSelector(state, { dottedName })
		})
	)
	const onGoingComputation = !results.filter(node => node.nodeValue != null)
		.length
	return (
		<div
			className="ui__ card lighter-bg"
			css="margin-top: 3rem; padding: 1rem 0"
		>
			<h1 css="text-align: center; margin-bottom: 2rem">
				Aide à la déclaration 📄
			</h1>
			{onGoingComputation && (
				<h2>
					<small>Calcul en cours...</small>
				</h2>
			)}
			<>
				<Animate.fromTop>
					{results.map(r => (
						<React.Fragment key={r.title}>
							<h4>
								{r.title} <small>{r.summary}</small>
							</h4>
							{r.description && <p className="ui__ notice">{r.description}</p>}
							<p className="ui__ lead" css="margin-bottom: 1rem;">
								<RuleLink dottedName={r.dottedName}>
									{r.nodeValue ? (
										formatValue({
											value: r.nodeValue,
											language: 'fr',
											unit: '€',
											maximumFractionDigits: 0
										})
									) : (
										<Skeleton width={80} />
									)}
								</RuleLink>
							</p>
						</React.Fragment>
					))}
				</Animate.fromTop>
				<div css="text-align: center">
					<button className="ui__ simple button">🔗 Obtenir le lien</button>
					<button className="ui__ simple button"> 🖨 Imprimer</button>
				</div>
			</>
		</div>
	)
}

const FormBlock = styled.section`
	max-width: 500px;
	padding: 0;

	h3 {
		margin-top: 50px;
	}

	select,
	input[type='text'] {
		font-size: 1.05em;
		padding: 5px 10px;
	}
	ul {
		padding: 0;
	}
`

const Question = styled.div`
	margin-top: 1em;
`
const BigInput = styled.div`
	font-size: 130%;
`
