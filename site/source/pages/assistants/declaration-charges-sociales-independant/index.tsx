import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import RuleInput from '@/components/conversation/RuleInput'
import { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { FromTop } from '@/components/ui/animate'
import Warning from '@/components/ui/WarningBlock'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import useSimulationConfig from '@/hooks/useSimulationConfig'
import { useSitePaths } from '@/sitePaths'
import { updateSituation } from '@/store/actions/actions'
import { SimulationConfig } from '@/store/reducers/rootReducer'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import { SimpleField, SubSection } from '../components/Fields'
import { ExplicationsResultatFiscal } from './components/ExplicationResultatFiscal'
import ResultatsSimples from './components/RésultatSimple'
import illustration from './undraw_fill_in_mie5.svg'

const config: SimulationConfig = {
	'objectifs exclusifs': [
		'déclaration charge sociales . résultat . cotisations obligatoires',
		'déclaration charge sociales . résultat . total charges sociales déductible',
		'déclaration charge sociales . résultat . revenu net fiscal',
		'déclaration charge sociales . résultat . assiette sociale',
	],
	situation: {
		'déclaration charge sociales': 'oui',
		'dirigeant . régime social': "'indépendant'",
		date: '01/01/2022',
		'dirigeant . indépendant . PL . CIPAV': 'non',
		'entreprise . catégorie juridique': "''",
		impôt: 'non',
	},
	'unité par défaut': '€',
}

export default function AideDéclarationIndépendant() {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		key: absoluteSitePaths.assistants[
			'déclaration-charges-sociales-indépendant'
		],
		config,
		autoloadLastSimulation: true,
	})
	const situation = useSelector(situationSelector)

	return (
		<>
			<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.description">
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
					<Body>
						Vous cotisez au régime général des travailleurs indépendants
					</Body>
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
						<Condition expression="déclaration charge sociales . comptabilité . engagement">
							<Trans i18nKey="pages.assistants.declaration-charges-sociales-independant.entreprise.titre">
								<H2>Entreprise et activité</H2>
							</Trans>
							<SimpleField
								dottedName="entreprise . date de création"
								showSuggestions={false}
							/>
							<Condition expression="entreprise . date de création > 31/12/2022">
								<SmallBody
									css={`
										color: #ff2d96;
										background-color: inherit;
									`}
								>
									Cette aide à la déclaration concerne uniquement les
									entreprises déjà en activité en 2022
								</SmallBody>
							</Condition>

							<SubSection dottedName="déclaration charge sociales . nature de l'activité" />
							{/* PLNR */}
							<SimpleField dottedName="entreprise . activités . commerciale . débit de tabac" />
							<SimpleField dottedName="dirigeant . indépendant . cotisations et contributions . déduction tabac" />
							<SimpleField dottedName="dirigeant . indépendant . PL . régime général . taux spécifique retraite complémentaire" />

							<H2>
								<Trans>Situation personnelle</Trans>
							</H2>
							<SimpleField dottedName="situation personnelle . RSA" />
							<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
								<SubSection dottedName="dirigeant . indépendant . IJSS" />
							</Condition>
							<SubSection dottedName="dirigeant . indépendant . conjoint collaborateur" />

							<H2>
								<Trans>Exonérations</Trans>
							</H2>

							<SimpleField dottedName="déclaration charge sociales . ACRE" />
							<SimpleField dottedName="établissement . ZFU" />
							<Condition expression="établissement . ZFU">
								<SimpleField dottedName="entreprise . salariés . effectif . seuil" />
							</Condition>
							<SubSection
								dottedName="dirigeant . indépendant . cotisations et contributions . exonérations"
								hideTitle
							/>

							<H2>
								<Trans>International</Trans>
							</H2>
							<SimpleField dottedName="situation personnelle . domiciliation fiscale à l'étranger" />
							<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
								<SubSection
									dottedName="dirigeant . indépendant . revenus étrangers"
									hideTitle
								/>
							</Condition>
						</Condition>

						<Condition expression="déclaration charge sociales . cotisations payées">
							<H2>Cotisations et contributions sociales en 2022</H2>
							<SimpleField dottedName="déclaration charge sociales . cotisations payées . cotisations sociales" />
							<SimpleField dottedName="déclaration charge sociales . cotisations payées . CSG déductible et CFP" />
						</Condition>
					</Grid>
				</Grid>
			</FromTop>

			<WhenAlreadyDefined dottedName="déclaration charge sociales . résultat . total charges sociales déductible">
				<ResultatsSimples />
			</WhenAlreadyDefined>
		</>
	)
}

function ImpositionSection() {
	const dispatch = useDispatch()

	const { t } = useTranslation()

	const setSituation = useCallback(
		(value: PublicodesExpression | undefined, dottedName: DottedName) => {
			dispatch(updateSituation(dottedName, value))
		},
		[dispatch]
	)

	return (
		<>
			<SimpleField
				aria-label={t("Régime d'imposition")}
				dottedName="entreprise . imposition"
			/>

			<WhenAlreadyDefined dottedName="entreprise . imposition">
				<SimpleField dottedName="déclaration charge sociales . comptabilité" />

				<Condition
					expression={'déclaration charge sociales . cotisations payées = non'}
				>
					<FromTop>
						<Condition expression="entreprise . imposition . IR">
							<SimpleField dottedName="entreprise . imposition . régime . micro-entreprise" />
							<Condition expression="entreprise . imposition . régime . micro-entreprise">
								<H2>Quel est votre chiffre d'affaires hors taxes en 2022 ?</H2>
								<SmallBody>
									Indiquez le montant hors taxes de votre chiffre d’affaires ou
									de vos recettes bruts (avant déduction de l’abattement
									forfaitaire pour frais et charges) et avant déduction des
									exonérations fiscales dont vous avez bénéficié
								</SmallBody>
								<SimpleField dottedName="entreprise . chiffre d'affaires . vente restauration hébergement" />
								<SimpleField dottedName="entreprise . chiffre d'affaires . service BIC" />
								<SimpleField dottedName="entreprise . chiffre d'affaires . service BNC" />
							</Condition>
							<Condition expression="entreprise . imposition . régime . micro-entreprise = non">
								<H2>
									Quel est votre résultat fiscal au titre de l'année 2022 ?
									<br />
									<small>
										Charges sociales et exonérations fiscales non incluses{' '}
										<ExplicationsResultatFiscal />
									</small>
								</H2>
								<SmallBody>
									Le résultat fiscal correspond aux produits moins les charges.
									Il peut être positif (bénéfice) ou négatif (déficit).
								</SmallBody>
								<BigInput>
									<RuleInput
										dottedName="dirigeant . rémunération . totale"
										onChange={setSituation}
										displayedUnit="€"
										aria-label={t('Résultat fiscal')}
									/>
								</BigInput>
							</Condition>
						</Condition>
						<Condition expression="entreprise . imposition . IS">
							<H2>
								Quel est le montant net de votre rémunération en 2022 ?
								<br />
								<small>Sans tenir compte des charges sociales</small>
							</H2>
							<BigInput>
								<RuleInput
									dottedName="dirigeant . rémunération . net"
									onChange={setSituation}
								/>
							</BigInput>
						</Condition>
					</FromTop>
				</Condition>
			</WhenAlreadyDefined>
		</>
	)
}

export const Question = styled.div`
	margin-top: 1em;
`
const BigInput = styled.div`
	font-size: 130%;
`
