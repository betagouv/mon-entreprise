import { setSimulationConfig, updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import Explicable from 'Components/conversation/Explicable'
import 'Components/TargetSelection.css'
import Warning from 'Components/ui/WarningBlock'
import { useEvaluation, EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import RuleInput from 'Components/conversation/RuleInput'
import { ParsedRule } from 'publicodes'
import React, { useCallback, useEffect, useState, useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import Animate from 'Components/ui/animate'
import { CompanySection } from '../Home'
import simulationConfig from './config.yaml'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import emoji from 'react-easy-emoji'
import RuleLink from 'Components/RuleLink'
import { formatValue } from 'Engine/format'
import Skeleton from 'react-loading-skeleton'

export default function() {
	const dispatch = useDispatch()
	const rules = useContext(EngineContext).getParsedRules()
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	useEffect(() => {
		dispatch(setSimulationConfig(simulationConfig, true))
	}, [])

	const dottedName = 'dirigeant . rémunération totale'
	const [resultsRef, resultsInViewPort] = useDisplayOnIntersecting({
		threshold: 0.5,
		unobserve: false
	})
	const value = useSelector(situationSelector)[dottedName]
	const [currentIncome, setCurrentIncome] = useState(value)
	const displayForm = currentIncome != null
	const updateIncome = useCallback(
		income => {
			setCurrentIncome(income)
		},
		[setCurrentIncome]
	)
	useEffect(() => {
		if (resultsInViewPort && displayForm) {
			dispatch(updateSituation(dottedName, currentIncome))
		} else {
			dispatch(updateSituation(dottedName, null))
		}
	}, [resultsInViewPort, displayForm, currentIncome])

	return (
		<div>
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
							<SimpleField dottedName="entreprise . catégorie d'activité . débit de tabac" />
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . déduction tabac" />
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . cotisations . retraite complémentaire . taux spécifique PLNR" />

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
						<Results />
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
	const parsedRules = useContext(EngineContext).getParsedRules()
	const ruleTitle = parsedRules[sectionDottedName]?.title
	const nextSteps = useNextQuestions()
	const situation = useSelector(situationSelector)
	const title = hideTitle ? null : ruleTitle
	const subQuestions = [
		...(Object.keys(situation) as Array<DottedName>),
		...nextSteps
	].filter(nextStep => {
		const { dottedName, question } = parsedRules[nextStep]
		return !!question && dottedName.startsWith(sectionDottedName)
	})

	return (
		<>
			{!!subQuestions.length && title && <h3>{title}</h3>}
			{subQuestions.map(dottedName => (
				<SimpleField key={dottedName} dottedName={dottedName} />
			))}
		</>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
	summary?: ParsedRule['summary']
	question?: ParsedRule['question']
}
function SimpleField({ dottedName, question, summary }: SimpleFieldProps) {
	const dispatch = useDispatch()
	const evaluatedRule = useEvaluation(dottedName, { useDefaultValues: false })
	const rules = useContext(EngineContext).getParsedRules()
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
	if (
		evaluatedRule.isApplicable === false ||
		evaluatedRule.isApplicable === null
	) {
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

function Results() {
	const results = useEvaluation(simulationConfig.objectifs as Array<DottedName>)
	const onGoingComputation = !results.filter(node => node.nodeValue != null)
		.length
	return (
		<div
			className="ui__ card lighter-bg"
			css="margin-top: 3rem; padding: 1rem 0"
		>
			<h1 css="text-align: center; margin-bottom: 2rem">
				<Trans i18nKey="aide-déclaration-indépendant.results.title">
					Aide à la déclaration
				</Trans>
				{emoji('📄')}
			</h1>
			{onGoingComputation && (
				<h2>
					<small>
						<Trans i18nKey="aide-déclaration-indépendant.results.ongoing">
							Calcul en cours...
						</Trans>
					</small>
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
									{r.nodeValue != null ? (
										formatValue({
											nodeValue: r.nodeValue || 0,
											language: 'fr',
											unit: '€',
											precision: 0
										})
									) : (
										<Skeleton width={80} />
									)}
								</RuleLink>
							</p>
						</React.Fragment>
					))}
				</Animate.fromTop>
			</>
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
