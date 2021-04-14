import { updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import { Explicable, ExplicableRule } from 'Components/conversation/Explicable'
import RuleInput from 'Components/conversation/RuleInput'
import Value, { Condition } from 'Components/EngineValue'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { EngineContext, useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackPage } from '../../../ATInternetTracking'
import { CompanySection } from '../Home'
import simulationConfig from './config.yaml'

export default function AideDéclarationIndépendant() {
	useSimulationConfig(simulationConfig)
	const dispatch = useDispatch()
	const engine = useEngine()

	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)

	const situation = useSelector(situationSelector)

	const setCurrentIncome = useCallback(
		(currentIncome) => {
			dispatch(
				updateSituation('dirigeant . rémunération . totale', currentIncome)
			)
		},
		[dispatch, updateSituation]
	)
	const displayForm =
		engine.evaluate('dirigeant . rémunération . totale').nodeValue !== null

	return (
		<div>
			<Trans i18nKey="aide-déclaration-indépendant.description">
				<p>
					Cet outil est une aide à la déclaration de revenus à destination des
					travailleurs indépendants. Il vous permet de connaître le montant des
					charges sociales déductibles à partir de votre résultat net fiscal.
				</p>
				<p>
					Vous restez entièrement responsable d'éventuelles omissions ou
					inexactitudes dans votre déclarations.
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
				<PreviousSimulationBanner />
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
					dottedName="dirigeant . rémunération . totale"
					onChange={setCurrentIncome}
					autoFocus
				/>
			</BigInput>
			{displayForm ? (
				<TrackPage name="commence" />
			) : (
				<TrackPage name="accueil" />
			)}
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
							<SimpleField
								dottedName="entreprise . date de création"
								showSuggestions={false}
							/>
							{situation['entreprise . date de création'] && (
								<>
									<Condition expression="entreprise . date de création > 31/12/2020">
										<small
											css={`
												color: #ff2d96;
											`}
										>
											Cette aide à la déclaration concerne uniquement les
											entreprises déjà en activité en 2020
										</small>
									</Condition>
									<Condition expression="entreprise . date de création < 01/01/2021">
										<SubSection dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />

										{/* PLNR */}
										<Condition expression="aide déclaration revenu indépendant 2020 . nature de l'activité">
											<SimpleField dottedName="entreprise . activité . débit de tabac" />
											<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
											<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />

											<SubSection dottedName="aide déclaration revenu indépendant 2020 . réduction covid" />

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
										</Condition>
									</Condition>
								</>
							)}
						</FormBlock>
					</Animate.fromTop>

					<Condition expression="aide déclaration revenu indépendant 2020 . nature de l'activité">
						<Results />
					</Condition>
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
	showSuggestions?: boolean
}
function SimpleField({
	dottedName,
	question,
	summary,
	showSuggestions,
}: SimpleFieldProps) {
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
							{question ?? rule.rawNode.question}&nbsp;
							<ExplicableRule dottedName={dottedName} />
						</p>
						<p className="ui__ notice">{summary ?? rule.rawNode.résumé}</p>
					</div>
					<RuleInput
						dottedName={dottedName}
						onChange={dispatchValue}
						showSuggestions={showSuggestions}
					/>
				</Question>
			</Animate.fromTop>
		</div>
	)
}

function Results() {
	const engine = useEngine()

	return (
		<div
			className="ui__ full-width lighter-bg"
			css={`
				margin-top: 2rem;
			`}
		>
			<div
				className="ui__ container"
				css={`
					display: flex;
					flex-direction: column;
				`}
			>
				<h2>
					{emoji('📄')}{' '}
					<Trans i18nKey="aide-déclaration-indépendant.results.title">
						Montants à reporter dans votre déclaration de revenus
					</Trans>
				</h2>
				<p>
					L'ancienne Déclaration Sociale des Indépendant (DSI) qui était
					précédemment à effectuer sur le site net-entreprises.fr est désormais
					intégrée à la déclaration fiscale des revenus (déclaration 2042) sur
					impots.gouv.fr.{' '}
					<a
						href="https://www.impots.gouv.fr/portail/www2/minisite/declaration/independants.html?11"
						target="_blank"
					>
						En savoir plus
					</a>
				</p>
				<p>
					Vous pouvez reporter les montants suivants dans votre déclaration,
					calculés à partir des informations saisies.
				</p>
				{([
					'aide déclaration revenu indépendant 2020 . cotisations obligatoires',
					'aide déclaration revenu indépendant 2020 . total charges sociales déductible',
				] as const).map((dottedName) => {
					const r = engine.getRule(dottedName)
					return (
						<Animate.fromTop key={dottedName}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									margin: 1rem 0;
								`}
							>
								<h3>
									{r.title} <small>{r.rawNode.résumé}</small>
								</h3>
								<p className="ui__ lead" css="margin-bottom: 1rem;">
									<strong>
										<RuleLink dottedName={r.dottedName}>
											<Value
												expression={r.dottedName}
												displayedUnit="€"
												unit="€/an"
												precision={0}
											/>
										</RuleLink>
									</strong>
								</p>
								{r.rawNode.description && (
									<div className="ui__ notice">
										<Markdown source={r.rawNode.description} />
									</div>
								)}
							</div>
						</Animate.fromTop>
					)
				})}
				<h2>{emoji('ℹ️')} Pour votre information </h2>
				<div
					css={`
						margin: 0 -0.5rem;
						display: grid;
						grid-gap: 0.5rem;
						grid-template-columns: repeat(3, auto);
					`}
				>
					{([
						'aide déclaration revenu indépendant 2020 . réduction covid . montant',
						'aide déclaration revenu indépendant 2020 . revenu net fiscal',
						'aide déclaration revenu indépendant 2020 . CSG déductible',
						'aide déclaration revenu indépendant 2020 . CFP',
						'aide déclaration revenu indépendant 2020 . assiette sociale',
					] as const).map((dottedName) => {
						const r = engine.getRule(dottedName)
						return (
							<Animate.fromTop style={{ display: 'flex' }} key={dottedName}>
								<div
									className="ui__ box card"
									css={`
										margin: 0;
										flex: 1 !important;
									`}
								>
									<p className="ui__ lead">
										<RuleLink dottedName={r.dottedName} />{' '}
										<small>{r.rawNode.résumé}</small>
									</p>

									{r.rawNode.description && (
										<div className="ui__ notice">
											<Markdown source={r.rawNode.description} />
										</div>
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
								</div>
							</Animate.fromTop>
						)
					})}
				</div>
			</div>
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
