import { updateSituation } from 'Actions/actions'
import Aide from 'Components/conversation/Aide'
import RuleInput from 'Components/conversation/RuleInput'
import { Condition } from 'Components/EngineValue'
import PageHeader from 'Components/PageHeader'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import 'Components/TargetSelection.css'
import Animate from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { useCallback } from 'react'
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
import ResultatsParFormulaire from './RésultatsParFormulaire'
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
	const displayForm = !!(
		situation['dirigeant . rémunération . totale'] ||
		situation['dirigeant . rémunération . nette']
	)
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
					<h3>Cet outil vous concerne si vous êtes dans le cas suivant :</h3>
					<ul>
						<li>
							vous cotisez au régime général des travailleurs indépendants
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
						<li>votre entreprise est domiciliée dans les DOM</li>
						<li>
							vous vous versez des dividendes soumis à cotisations sociales
						</li>
					</ul>
				</Warning>
				{displayForm ? (
					<TrackPage name="commence" />
				) : (
					<TrackPage name="accueil" />
				)}
				{!situation['dirigeant . rémunération . totale'] && (
					<PreviousSimulationBanner />
				)}
				<h2>Imposition</h2>
				<p className="ui__ notice">
					Ces quelques questions permettent de déterminer le type de déclaration
					à remplir, ainsi que les modalités de calcul des cotisations social.
				</p>
			</Trans>
			<SimpleField dottedName="entreprise . imposition" />
			<SimpleField dottedName="aide déclaration revenu indépendant 2020 . comptabilité" />

			{situation['entreprise . imposition'] !== undefined && (
				<Animate.fromTop key={situation['entreprise . imposition']}>
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
				</Animate.fromTop>
			)}

			{displayForm && (
				<>
					<Animate.fromTop>
						<FormBlock>
							<Condition expression="aide déclaration revenu indépendant 2020 . comptabilité . engagement">
								<Trans i18nKey="aide-déclaration-indépendant.entreprise.titre">
									<h2>Entreprise et activité</h2>
								</Trans>
								<div>
									{!company && (
										<p className="ui__ notice">
											<Trans i18nKey="aide-déclaration-indépendant.entreprise.description">
												<strong>Facultatif : </strong>Vous pouvez renseigner
												votre entreprise pour pré-remplir le formulaire
											</Trans>
										</p>
									)}
									<CompanySection company={company} />
								</div>
								<SimpleField
									dottedName="entreprise . date de création"
									showSuggestions={false}
								/>
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
								<SubSection dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />
								{/* PLNR */}
								<SimpleField dottedName="entreprise . activité . débit de tabac" />
								<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
								<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />

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

								<SubSection dottedName="dirigeant . indépendant . cotisations facultatives" />
								<h2>
									<Trans>International</Trans>
								</h2>
								<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
								<SubSection
									dottedName="dirigeant . indépendant . revenus étrangers"
									hideTitle
								/>
							</Condition>
							<Condition expression="aide déclaration revenu indépendant 2020 . comptabilité . trésorerie">
								<SimpleField dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />
								<SubSection dottedName="aide déclaration revenu indépendant 2020 . comptabilité . trésorerie" />
								<SimpleField dottedName="dirigeant . indépendant . conjoint collaborateur" />

								<SubSection dottedName="dirigeant . indépendant . cotisations facultatives" />

								{/* We can't use a subsection here cause revenu étrangers is not missing when CSG is replaced */}
								<h3>
									<Trans>Revenus étranger</Trans>
								</h3>
								<SimpleField dottedName="dirigeant . indépendant . revenus étrangers" />
								<Condition expression="dirigeant . indépendant . revenus étrangers">
									<SimpleField dottedName="dirigeant . indépendant . revenus étrangers . montant" />
								</Condition>
							</Condition>

							<Condition expression="aide déclaration revenu indépendant 2020 . comptabilité . engagement">
								<SubSection dottedName="aide déclaration revenu indépendant 2020 . réduction covid" />
							</Condition>
						</FormBlock>
					</Animate.fromTop>

					<SubSection dottedName="aide déclaration revenu indépendant 2020 . régime d'imposition" />

					<Condition
						expression={{
							'une de ces conditions': [
								"aide déclaration revenu indépendant 2020 . régime d'imposition . réel",
								"aide déclaration revenu indépendant 2020 . régime d'imposition . déclaration contrôlée",
							],
						}}
					>
						<TrackPage name="simulation terminée" />
						<ResultatsParFormulaire />
					</Condition>
					<Aide />
				</>
			)}
		</>
	)
}

export const Question = styled.div`
	margin-top: 1em;
`
const BigInput = styled.div`
	font-size: 130%;
`

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
