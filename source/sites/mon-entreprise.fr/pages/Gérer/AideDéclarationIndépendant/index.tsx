import { setSimulationConfig, updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import Explicable from 'Components/conversation/Explicable'
import 'Components/TargetSelection.css'
import Warning from 'Components/ui/WarningBlock'
import { ScrollToTop } from 'Components/utils/Scroll'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import RuleInput from 'Engine/RuleInput'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	nextStepsSelector,
	parsedRulesSelector,
	ruleAnalysisSelector,
	situationSelector
} from 'Selectors/analyseSelectors'
import styled from 'styled-components'
import { DottedName, Rule } from 'Types/rule'
import Animate from 'Ui/animate'
import { useRule } from '../../Simulateurs/ArtisteAuteur'
import { CompanySection } from '../Home'
import simulationConfig from './config.yaml'
import { Results } from './Result'

const lauchComputationWhenResultsInViewport = () => {
	const dottedName = 'dirigeant . rémunération totale'
	const [resultsRef, resultsInViewPort] = useDisplayOnIntersecting({
		threshold: 0.5,
		unobserve: false
	})
	const value = useSelector(situationSelector)[dottedName]
	const [currentIncome, setCurrentIncome] = useState(value)
	const [displayForm, setDisplayForm] = useState(currentIncome != null)
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
			dispatch(updateSituation(dottedName, currentIncome))
		} else {
			dispatch(updateSituation(dottedName, null))
		}
	}, [resultsInViewPort, displayForm, currentIncome])

	return { updateIncome, resultsRef, displayForm, currentIncome }
}

export default function AideDéclarationIndépendant() {
	const dispatch = useDispatch()
	const rules = useSelector(parsedRulesSelector)
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	dispatch(setSimulationConfig(simulationConfig, true))
	const {
		resultsRef,
		displayForm,
		updateIncome,
		currentIncome
	} = lauchComputationWhenResultsInViewport()
	const printComponentRef = useRef<HTMLDivElement>(null)
	return (
		<div ref={printComponentRef}>
			<ScrollToTop />
			<Trans i18nKey="aide-déclaration-indépendant.description">
				<h1>Aide à la déclaration de revenus au titre de l'année 2019</h1>
				<p>
					Cet outil est une aide aux déclarations fiscale (revenu) et sociale
					(DSI) à destination des travailleurs indépendants. Il vous permet de
					connaître le montant des charges sociales déductibles à partir de
					votre résultat net fiscal.
				</p>
				<div
					css={`
						@media print {
							display: none;
						}
					`}
				>
					<Warning localStorageKey="aide-déclaration-indépendant.warning">
						<h3>
							Cet outil vous concerne si vous êtes dans tous les cas suivants :
						</h3>
						<ul>
							<li>
								vous cotisez au régime général des travailleurs indépendants
							</li>
							<li>
								votre entreprise est au régime réel d'imposition et en
								comptabilité d'engagement
							</li>
						</ul>
						<h3>
							Il ne vous concerne pas si vous êtes dans un des cas suivants :
						</h3>
						<ul>
							<li>
								vous exercez une activité libérale relevant d’un régime de
								retraite des professions libérales
							</li>
							<li>
								vous êtes gérants de société relevant de l’impôt sur les
								sociétés
							</li>
							<li>vous avez opté pour le régime micro-fiscal</li>
							<li>votre entreprise est domiciliée dans les DOM</li>
						</ul>
					</Warning>
				</div>
				<h2>
					Quel est votre résultat fiscal en 2019 ?<br />
					<small>Charges sociales et exonérations fiscales non incluses</small>
				</h2>
				<p className="ui__ notice">
					Le résultat fiscal correspond aux produits moins les charges. Il peut
					être positif (bénéfice) ou négatif (pertes).
				</p>
			</Trans>
			<BigInput>
				<RuleInput
					rules={rules}
					dottedName="dirigeant . rémunération totale"
					onChange={updateIncome}
					value={currentIncome}
					autoFocus
				/>
			</BigInput>
			{displayForm && (
				<>
					<Animate.fromTop>
						<FormBlock>
							<Trans i18nKey="aide-déclaration-indépendant.entreprise.titre">
								<h2>Entreprise et activité</h2>
							</Trans>
							<div
								css={`
									@media print {
										display: none;
									}
								`}
							>
								{!company && (
									<p className="ui__ notice">
										<Trans i18nKey="aide-déclaration-indépendant.entreprise.description">
											<strong>Facultatif : </strong>Vous pouvez renseigner votre
											entreprise pour pré-remplir le formulaire
										</Trans>
									</p>
								)}
								<CompanySection company={company} />
							</div>
							<SimpleField dottedName="entreprise . date de création" />
							<SubSection dottedName="aide déclaration revenu indépendant 2019 . nature de l'activité" />
							{/* PLNR */}
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux spécifique PLNR" />
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . déduction tabac" />

							<h2>
								<Trans>Situation personnelle</Trans>
							</h2>
							<SimpleField dottedName="situation personnelle . RSA" />
							<SubSection dottedName="dirigeant . indépendant . IJSS" />
							<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

							<h2>
								<Trans>Exonérations</Trans>
							</h2>
							<SimpleField dottedName="entreprise . ACRE" />
							<SimpleField dottedName="établissement . ZFU" />
							<SubSection
								hideTitle
								dottedName="entreprise . effectif . seuil"
							/>

							<SubSection
								dottedName="dirigeant . indépendant . cotisations et contributions . exonérations"
								hideTitle
							/>

							<h2>
								<Trans>International</Trans>
							</h2>
							<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
							<SubSection
								dottedName="dirigeant . indépendant . revenus étrangers"
								hideTitle
							/>
						</FormBlock>
					</Animate.fromTop>

					<div ref={resultsRef}>
						<Results componentRef={printComponentRef} />
					</div>
					<Aide />
				</>
			)}
		</div>
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
	const parsedRules = useSelector(parsedRulesSelector)
	const ruleTitle = useRule(sectionDottedName)?.title
	const nextSteps = useSelector(nextStepsSelector)
	const situation = useSelector(situationSelector)
	const title = hideTitle ? null : ruleTitle
	const subQuestions = Object.values(parsedRules).filter(
		({ dottedName, question }) =>
			Boolean(question) &&
			dottedName.startsWith(sectionDottedName) &&
			(Object.keys(situation).includes(dottedName) ||
				nextSteps.includes(dottedName))
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
	const evaluatedRule = useSelector((state: RootState) => {
		return ruleAnalysisSelector(state, { dottedName })
	})
	const rules = useSelector(parsedRulesSelector)
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

	if (!evaluatedRule.isApplicable) {
		return null
	}
	return (
		<div
			css={`
				break-inside: avoid;
			`}
		>
			<Animate.fromTop>
				<Question>
					<div
						css={`
							border-left: 3px solid var(--lightColor);
							padding-left: 0.6rem;
							@media print {
								padding-left: 0 !important;
							}
						`}
					>
						<p>
							{question ?? evaluatedRule.question}
							<Explicable dottedName={dottedName} />
						</p>
						<p className="ui__ notice">{summary ?? evaluatedRule.summary}</p>
					</div>
					<RuleInput
						rules={rules}
						dottedName={dottedName}
						onChange={update}
						value={currentValue}
					/>
				</Question>
			</Animate.fromTop>
		</div>
	)
}

const FormBlock = styled.section`
	max-width: 500px;
	padding: 0;

	h3 {
		margin-top: 2rem;
	}
	h2 {
		border-top: 1px solid var(--lighterColor);
		padding-top: 2rem;
		break-after: avoid;
	}

	select,
	input[type='text'] {
		font-size: 1.05em;
		padding: 5px 10px;
	}
	ul {
		padding: 0;
		margin: 0;
	}
`

const Question = styled.div`
	margin-top: 1em;
`
const BigInput = styled.div`
	font-size: 130%;
`
