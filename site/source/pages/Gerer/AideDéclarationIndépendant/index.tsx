import { Grid } from '@mui/material'
import { updateSituation } from 'Actions/actions'
import RuleInput from 'Components/conversation/RuleInput'
import { Condition } from 'Components/EngineValue'
import PageHeader from 'Components/PageHeader'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { FromTop } from 'Components/ui/animate'
import Warning from 'Components/ui/WarningBlock'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { Strong } from 'DesignSystem/typography'
import { H2, H3 } from 'DesignSystem/typography/heading'
import { Li, Ul } from 'DesignSystem/typography/list'
import { Body, Intro, SmallBody } from 'DesignSystem/typography/paragraphs'
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
import ResultatsSimples from './RésultatSimple'
import ResultatsParFormulaire from './RésultatsParFormulaire'
import illustration from './undraw_fill_in_mie5.svg'

/**
 * Nous avons proposé une nouvelle vision des résultat plus complète, avec une proposition d'aide pour
 * l'ensemble des cases liées aux cotisations sociales.
 *
 * Hors de propos pour 2021, étant donné que cela prendrait beaucoup de temps à valider par la DGFiP
 * En attendant, on propose la version "simple" (mais moins utile).
 *
 * Le but est de faire valider la version plus complète pour la déclaration de revenu 2021.
 */
const FEATURE_FLAG_RESULTATS_COMPLETS =
	!import.meta.env.SSR && document.location.search.includes('next')

export default function AideDéclarationIndépendant() {
	useSimulationConfig(simulationConfig)

	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
	const situation = useSelector(situationSelector)
	return (
		<>
			<Trans i18nKey="aide-déclaration-indépendant.description">
				<PageHeader picture={illustration}>
					<Intro>
						Cet outil est une aide à la déclaration de revenus à destination des{' '}
						<Strong>travailleurs indépendants</Strong>. Il vous permet de
						connaître le montant des charges sociales déductibles.
					</Intro>
					<SmallBody>
						Vous restez entièrement responsable d'éventuelles omissions ou
						inexactitudes dans votre déclaration.
					</SmallBody>
				</PageHeader>
				<Warning localStorageKey="aide-déclaration-indépendant.warning">
					<Body>
						<Strong>
							Cet outil vous concerne si vous êtes dans le cas suivant :
						</Strong>
					</Body>
					<Ul>
						<Li>
							Vous cotisez au régime général des travailleurs indépendants
						</Li>
					</Ul>
					<Body>
						<Strong>
							Il ne vous concerne pas si vous êtes dans un des cas suivants :
						</Strong>
					</Body>
					<Ul>
						<Li>
							Vous exercez une activité libérale relevant d’un régime de
							retraite des professions libérales en comptabilité d'engagement
						</Li>
						<Li>Votre entreprise est domiciliée dans les DOM</Li>
					</Ul>
				</Warning>
				<PreviousSimulationBanner />

				<H2>Imposition</H2>
				<Body>
					Ces quelques questions permettent de déterminer le type de déclaration
					à remplir, ainsi que les modalités de calcul des cotisations sociales.
				</Body>
			</Trans>
			{Object.keys(situation).length ? (
				<TrackPage name="commence" />
			) : (
				<TrackPage name="accueil" />
			)}

			<ImpositionSection />

			<FromTop>
				<Grid container>
					<Grid item xs={12} sm={10} md={9} lg={8}>
						<Condition expression="aide déclaration revenu indépendant 2020 . comptabilité . engagement">
							<Trans i18nKey="aide-déclaration-indépendant.entreprise.titre">
								<H2>Entreprise et activité</H2>
							</Trans>
							<>
								{!company && (
									<SmallBody>
										<Trans i18nKey="aide-déclaration-indépendant.entreprise.description">
											<strong>Facultatif : </strong>Vous pouvez renseigner votre
											entreprise pour pré-remplir le formulaire
										</Trans>
									</SmallBody>
								)}
								<CompanySection company={company} />
							</>
							<SimpleField
								dottedName="entreprise . date de création"
								showSuggestions={false}
							/>
							<Condition expression="entreprise . date de création > 31/12/2020">
								<SmallBody
									css={`
										color: #ff2d96;
									`}
								>
									Cette aide à la déclaration concerne uniquement les
									entreprises déjà en activité en 2020
								</SmallBody>
							</Condition>

							<SubSection dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />
							{/* PLNR */}
							<SimpleField dottedName="entreprise . activité . débit de tabac" />
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
							<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />

							<H2>
								<Trans>Situation personnelle</Trans>
							</H2>
							<SimpleField dottedName="situation personnelle . RSA" />
							<Condition expression="entreprise . imposition . IR . micro-fiscal = non">
								<SubSection dottedName="dirigeant . indépendant . IJSS" />
							</Condition>
							<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

							<H2>
								<Trans>Exonérations</Trans>
							</H2>
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
							{FEATURE_FLAG_RESULTATS_COMPLETS && (
								<SubSection dottedName="dirigeant . indépendant . cotisations facultatives" />
							)}
							<H2>
								<Trans>International</Trans>
							</H2>
							<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
							<Condition expression="entreprise . imposition . IR . micro-fiscal = non">
								<SubSection
									dottedName="dirigeant . indépendant . revenus étrangers"
									hideTitle
								/>
							</Condition>
							<SubSection dottedName="aide déclaration revenu indépendant 2020 . réduction covid" />
						</Condition>

						<Condition expression="aide déclaration revenu indépendant 2020 . cotisations payées">
							<SubSection dottedName="aide déclaration revenu indépendant 2020 . cotisations payées" />
							<SimpleField dottedName="aide déclaration revenu indépendant 2020 . nature de l'activité" />
							<SimpleField dottedName="dirigeant . indépendant . conjoint collaborateur" />
							<SubSection dottedName="dirigeant . indépendant . cotisations facultatives" />
							{/* We can't use a subsection here cause revenu étrangers is not missing when CSG is replaced */}
							<H3>
								<Trans>Revenus étranger</Trans>
							</H3>
							<SimpleField dottedName="dirigeant . indépendant . revenus étrangers" />
							<Condition expression="dirigeant . indépendant . revenus étrangers">
								<SimpleField dottedName="dirigeant . indépendant . revenus étrangers . montant" />
							</Condition>
						</Condition>

						<Condition expression="aide déclaration revenu indépendant 2020 . cotisations payées version simple">
							<SimpleField dottedName="aide déclaration revenu indépendant 2020 . cotisations payées version simple . cotisations sociales" />
							<SimpleField dottedName="aide déclaration revenu indépendant 2020 . cotisations payées version simple . CSG déductible et CFP" />
						</Condition>
					</Grid>
				</Grid>
			</FromTop>
			{FEATURE_FLAG_RESULTATS_COMPLETS ? (
				<>
					<SubSection dottedName="aide déclaration revenu indépendant 2020 . régime d'imposition" />
					<Condition
						expression={{
							'une de ces conditions': [
								"aide déclaration revenu indépendant 2020 . régime d'imposition . réel",
								"aide déclaration revenu indépendant 2020 . régime d'imposition . déclaration contrôlée",
								'entreprise . imposition . IR . micro-fiscal',
							],
						}}
					>
						<TrackPage name="simulation terminée" />
						<ResultatsParFormulaire />
					</Condition>
				</>
			) : (
				<ResultatsSimples />
			)}
		</>
	)
}

function ImpositionSection() {
	const dispatch = useDispatch()

	const situation = useSelector(situationSelector)
	const setSituation = useCallback(
		(value, dottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)
	return (
		<>
			<SimpleField dottedName="entreprise . imposition" />
			{situation['entreprise . imposition'] != null && (
				<>
					{/* <WhenApplicable dottedName="aide déclaration revenu indépendant 2020 . comptabilité"> */}
					<SimpleField dottedName="aide déclaration revenu indépendant 2020 . comptabilité" />
					{/* </WhenApplicable> */}
					<Condition
						expression={
							FEATURE_FLAG_RESULTATS_COMPLETS
								? 'oui'
								: 'aide déclaration revenu indépendant 2020 . cotisations payées version simple = non'
						}
					>
						<FromTop key={situation['entreprise . imposition']}>
							<Condition expression="entreprise . imposition . IR">
								<SimpleField dottedName="entreprise . imposition . IR . micro-fiscal" />
								<Condition expression="entreprise . imposition . IR . micro-fiscal">
									<H2>
										Quel est votre chiffre d'affaires hors taxes en 2020 ?
									</H2>
									<SmallBody>
										Indiquez le montant hors taxes de votre chiffre d’affaires
										ou de vos recettes bruts (avant déduction de l’abattement
										forfaitaire pour frais et charges) et avant déduction des
										exonérations fiscales dont vous avez bénéficié
									</SmallBody>
									<SimpleField dottedName="entreprise . chiffre d'affaires . vente restauration hébergement" />
									<SimpleField dottedName="entreprise . chiffre d'affaires . service BIC" />
									<SimpleField dottedName="entreprise . chiffre d'affaires . service BNC" />
								</Condition>
								<Condition expression="entreprise . imposition . IR . micro-fiscal = non">
									<H2>
										Quel est votre résultat fiscal en 2020 ?<br />
										<small>
											Charges sociales et exonérations fiscales non incluses{' '}
											<ExplicationsResultatFiscal />
										</small>
									</H2>
									<SmallBody>
										Le résultat fiscal correspond aux produits moins les
										charges. Il peut être positif (bénéfice) ou négatif
										(déficit).
									</SmallBody>
									<BigInput>
										<RuleInput
											dottedName="dirigeant . rémunération . totale"
											onChange={setSituation}
											autoFocus
										/>
									</BigInput>
								</Condition>
							</Condition>
							<Condition expression="entreprise . imposition . IS">
								<H2>
									Quel est le montant net de votre rémunération en 2020 ?
									<br />
									<small>Sans tenir compte des charges sociales</small>
								</H2>
								<BigInput>
									<RuleInput
										dottedName="dirigeant . rémunération . nette"
										onChange={setSituation}
										autoFocus
									/>
								</BigInput>
							</Condition>
						</FromTop>
					</Condition>
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
