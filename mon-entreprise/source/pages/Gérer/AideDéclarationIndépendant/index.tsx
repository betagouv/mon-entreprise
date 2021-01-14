import { updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import { Explicable, ExplicableRule } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import Value, { Condition } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { EngineContext, useEngine } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import useDisplayOnIntersecting from 'Components/utils/useDisplayOnIntersecting'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { Fragment, useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { CompanySection } from '../Home'
import simulationConfig from './config.yaml'

export default function AideDéclarationIndépendant() {
	useSimulationConfig(simulationConfig)
	const dispatch = useDispatch()
	const engine = useEngine()

	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)

	const [resultsRef, resultsInViewPort] = useDisplayOnIntersecting({
		threshold: 0.5,
		unobserve: false,
	})
	const setCurrentIncome = useCallback(
		(currentIncome) => {
			dispatch(
				updateSituation('dirigeant . rémunération totale', currentIncome)
			)
		},
		[dispatch, updateSituation]
	)
	const displayForm =
		engine.evaluate('dirigeant . rémunération totale').nodeValue !== null

	return (
		<div>
			<ScrollToTop />
			<Trans i18nKey="aide-déclaration-indépendant.description">
				<h1>Aide à la déclaration de revenus au titre de l'année 2020</h1>
				<p>
					Cet outil est une aide aux déclarations fiscale (revenu) et sociale (
					<abbr title="Déclaration Sociale des Indépendants">DSI</abbr>) à
					destination des travailleurs indépendants. Il vous permet de connaître
					le montant des charges sociales déductibles à partir de votre résultat
					net fiscal.
				</p>
				<p>
					Vous restez entièrement responsable d'éventuelles omissions ou
					inexactitudes dans vos déclarations.
				</p>
				<div>
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
					Quel est votre résultat fiscal en 2020 ?<br />
					<small>
						Charges sociales et exonérations fiscales non incluses{' '}
						<ExplicationsResultatFiscal />
					</small>
				</h2>
				<p className="ui__ notice">
					Le résultat fiscal correspond aux produits moins les charges. Il peut
					être positif (bénéfice) ou négatif (déficit).
				</p>
			</Trans>
			<BigInput>
				<RuleInput
					dottedName="dirigeant . rémunération totale"
					onChange={setCurrentIncome}
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
							<div>
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
							<SubSection dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />
							{/* PLNR */}
							<Condition expression="aide déclaration revenu indépendant 2020 . nature de l'activité">
								<SimpleField dottedName="entreprise . activité . débit de tabac" />
								<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
								<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />
							</Condition>

							<h2>
								<Trans>Situation personnelle</Trans>
							</h2>
							<SimpleField dottedName="situation personnelle . RSA" />
							<SubSection dottedName="dirigeant . indépendant . IJSS" />
							<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

							<h2>
								<Trans>Exonérations</Trans>
							</h2>
							<SimpleField dottedName="aide déclaration revenu indépendant 2020 . ACRE" />
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
function ExplicationsResultatFiscal() {
	return (
		<Explicable>
			<>
				<h3>Quelles exonérations inclure ?</h3>
				<p>
					Pour calculer le montant du résultat fiscal avant déduction des
					exonérations et des charges sociales à indiquer dans ce simulateur,
					vous pouvez utiliser votre liasse fiscale, en reprenant les montants
					indiqués dans les lignes fiscales du tableau ci-dessous, en fonction
					de votre situation (imposition au réel normal ou au réel simplifié).
				</p>
				<p>L’opération à effectuer est la suivante :</p>
				<ul>
					<li>
						Déterminez le résultat fiscal dans votre liasse, sans déduire le
						montant de vos cotisations et contributions sociales aux régimes
						obligatoires de sécurité sociale. Prenez le résultat fiscal
						correspondant <strong>(1)</strong>
					</li>
					<li>
						Ajoutez les exonérations <strong>(2)</strong>
					</li>
				</ul>
				<table
					css={`
						font-size: 0.85em;
						text-align: center;

						tr:nth-child(2n) {
							background: #e5effa;
						}

						td {
							padding: 0.5rem;
						}
					`}
				>
					<tr>
						<td></td>
						<td>
							Résultat fiscal <strong>(1)</strong>
						</td>
						<td colSpan={4}>
							Exonérations <strong>(2)</strong>
						</td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td>Exonérations liées aux zones / activités</td>
						<td>Exonérations Madelin et plan d’épargne retraite</td>
						<td>Exonérations de plus-values à court terme</td>
						<td>Suramortissement productif</td>
					</tr>
					<tr>
						<td>BIC réel normal</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Ligne XN (bénéfice) Ligne XO (déficit)
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Lignes K9 / L6 / ØV / PP / L2 / 1F / L5 / PA / XC / PB
						</td>
						<td>
							<strong>2053-SD</strong>
							<br />
							Lignes A7 et A8
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Ligne XG (montant inclus)
						</td>
						<td>
							<strong>2058-A-SD</strong>
							<br />
							Lignes X9 et YA
						</td>
					</tr>
					<tr>
						<td>BIC réel simplifié</td>
						<td>
							<strong>2033-B-SD</strong>
							<br />
							Ligne 370 (bénéfice) Ligne 372 déficit)
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Lignes 986 / 127 / 991 / 345 / 992 / 987 / 989 / 990 / 993
						</td>
						<td>
							<strong>2033-SD</strong>
							<br />
							Lignes 325 et 327
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Ligne 350 (montant inclus)
						</td>
						<td>
							<strong>2033 B-SD</strong>
							<br />
							Lignes 655 et 643
						</td>
					</tr>
				</table>
			</>
		</Explicable>
	)
}

function SubSection({
	dottedName: sectionDottedName,
	hideTitle = false,
}: SubSectionProp) {
	const engine = useContext(EngineContext)
	const ruleTitle = engine.getRule(sectionDottedName)?.title
	const nextSteps = useNextQuestions()
	const situation = useSelector(situationSelector)
	const title = hideTitle ? null : ruleTitle
	const subQuestions = [
		...(Object.keys(situation) as Array<DottedName>),
		...nextSteps,
	].filter((nextStep) => {
		const {
			dottedName,
			rawNode: { question },
		} = engine.getRule(nextStep)
		return !!question && dottedName.startsWith(sectionDottedName)
	})

	return (
		<>
			{!!subQuestions.length && title && <h3>{title}</h3>}
			{subQuestions.map((dottedName) => (
				<SimpleField key={dottedName} dottedName={dottedName} />
			))}
		</>
	)
}

type SimpleFieldProps = {
	dottedName: DottedName
	summary?: RuleNode['rawNode']['résumé']
	question?: RuleNode['rawNode']['question']
}
function SimpleField({ dottedName, question, summary }: SimpleFieldProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const situation = useSelector(situationSelector)

	const dispatchValue = useCallback(
		(value) => {
			dispatch(updateSituation(dottedName, value))
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: dottedName,
			})
		},
		[dispatch, dottedName]
	)

	if (
		!(dottedName in situation) &&
		evaluation.nodeValue === false &&
		!(dottedName in evaluation.missingVariables)
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
						`}
					>
						<p>
							{question ?? rule.rawNode.question}
							<ExplicableRule dottedName={dottedName} />
						</p>
						<p className="ui__ notice">{summary ?? rule.rawNode.résumé}</p>
					</div>
					<RuleInput dottedName={dottedName} onChange={dispatchValue} />
				</Question>
			</Animate.fromTop>
		</div>
	)
}

function Results() {
	const engine = useEngine()
	const rules = (simulationConfig.objectifs as DottedName[]).map((objectif) =>
		engine.getRule(objectif)
	)
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
			<>
				<Animate.fromTop>
					{rules.map((r) => (
						<Fragment key={r.dottedName}>
							<h4>
								{r.title} <small>{r.rawNode.résumé}</small>
							</h4>
							{r.rawNode.description && (
								<p className="ui__ notice">{r.rawNode.description}</p>
							)}
							<p className="ui__ lead" css="margin-bottom: 1rem;">
								<RuleLink dottedName={r.dottedName}>
									<Value
										expression={r.dottedName}
										displayedUnit="€"
										unit="€/an"
										precision={0}
									/>
								</RuleLink>
							</p>
						</Fragment>
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
