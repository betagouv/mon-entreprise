import { updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import RuleInput from 'Components/conversation/RuleInput'
import Value, { Condition, WhenAlreadyDefined } from 'Components/EngineValue'
import PageHeader from 'Components/PageHeader'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import RuleLink from 'Components/RuleLink'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { useCallback } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackPage } from '../../../ATInternetTracking'
import { CompanySection } from '../Home'
import simulationConfig from './config.yaml'
import { ExplicationsResultatFiscal } from './ExplicationResultatFiscal'
import { SimpleField, SubSection } from './Fields'
import illustration from './undraw_fill_in_mie5.svg'
export default function AideDéclarationIndépendant() {
	useSimulationConfig(simulationConfig)
	const dispatch = useDispatch()

	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)

	const situation = useSelector(situationSelector)
	const setSituation = useCallback(
		(value, dottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)
	const displayForm =
		situation['dirigeant . rémunération . totale'] ||
		situation['dirigeant . rémunération . nette']

	return (
		<>
			<Trans i18nKey="aide-déclaration-indépendant.description">
				<PageHeader picture={illustration}>
					<p className="ui__ lead">
						Cet outil est une aide à la déclaration de revenus à destination des{' '}
						<strong>travailleurs indépendants</strong>. Il vous permet de
						connaître le montant des charges sociales déductibles applicable à
						votre rémunération.
					</p>
					<p className="ui__ notice">
						Vous restez entièrement responsable d'éventuelles omissions ou
						inexactitudes dans votre déclarations.
					</p>
				</PageHeader>

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
						<li>vous avez opté pour le régime micro-fiscal</li>
						<li>
							vous êtes dans le cas d'une entreprise avec plusieurs associés
						</li>
						<li>votre entreprise est domiciliée dans les DOM</li>
					</ul>
				</Warning>

				{!situation['dirigeant . rémunération . totale'] && (
					<PreviousSimulationBanner />
				)}
				<h2>Imposition et comptabilité</h2>
				<p className="ui__ notice">
					Ces quelques questions permettent de déterminer le type de déclaration
					à remplir, ainsi que les modalités de calcul des cotisations social.
				</p>

				<SimpleField dottedName="entreprise . imposition" />
				{situation['entreprise . imposition'] && (
					<>
						<Condition expression="entreprise . imposition . IR">
							<h2>
								Quel est votre résultat fiscal en 2020 ?<br />
								<small>
									Charges sociales et exonérations fiscales non incluses{' '}
									<ExplicationsResultatFiscal />
								</small>
							</h2>
							<p className="ui__ notice">
								Le résultat fiscal correspond aux produits moins les charges. Il
								peut être positif (bénéfice) ou négatif (déficit).
							</p>
							<BigInput>
								<RuleInput
									dottedName="dirigeant . rémunération . totale"
									onChange={setSituation}
									autoFocus
								/>
							</BigInput>
						</Condition>
						<Condition expression="entreprise . imposition . IS">
							<h2>
								Quel est le montant net de votre rémunération en 2020 ?
								<br />
								<small>Sans tenir compte des charges sociales</small>
							</h2>
							<BigInput>
								<RuleInput
									dottedName="dirigeant . rémunération . nette"
									onChange={setSituation}
									autoFocus
								/>
							</BigInput>
						</Condition>
					</>
				)}
			</Trans>

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
										<WhenAlreadyDefined dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité">
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
											<Condition expression="entreprise . imposition . IS">
												<SubSection dottedName="dirigeant . indépendant . contrats madelin" />
											</Condition>

											<h2>
												<Trans>International</Trans>
											</h2>
											<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
											<SubSection
												dottedName="dirigeant . indépendant . revenus étrangers"
												hideTitle
											/>
										</WhenAlreadyDefined>
									</Condition>
								</>
							)}
						</FormBlock>
					</Animate.fromTop>

					<WhenAlreadyDefined dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité">
						<Results />
					</WhenAlreadyDefined>
					<Aide />
				</>
			)}
		</>
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
					'aide déclaration revenu indépendant 2020 . total charges sociales déductibles IS',
					'aide déclaration revenu indépendant 2020 . rémunération nette dirigeant',
					'aide déclaration revenu indépendant 2020 . traitements et salaires',
					'aide déclaration revenu indépendant 2020 . cotisations obligatoires',
					'aide déclaration revenu indépendant 2020 . total charges sociales déductibles IR',
				] as const).map((dottedName) => {
					const r = engine.getRule(dottedName)
					const evaluation = engine.evaluate(dottedName)
					if (evaluation.nodeValue == null || evaluation.nodeValue == false) {
						return
					}
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
						'aide déclaration revenu indépendant 2020 . cotisations non déductible',
						'aide déclaration revenu indépendant 2020 . réduction covid . total',
						'aide déclaration revenu indépendant 2020 . revenu net fiscal',
						'aide déclaration revenu indépendant 2020 . CSG déductible',
						'aide déclaration revenu indépendant 2020 . CFP',
						'aide déclaration revenu indépendant 2020 . assiette sociale',
					] as const).map((dottedName) => {
						const r = engine.getRule(dottedName)
						const evaluation = engine.evaluate(dottedName)
						if (evaluation.nodeValue == null || evaluation.nodeValue == false) {
							return
						}
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

export const Question = styled.div`
	margin-top: 1em;
`
const BigInput = styled.div`
	font-size: 130%;
`
