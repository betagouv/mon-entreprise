import { DottedName } from '@/../../modele-social'
import { CompanyDetails } from '@/components/company/Details'
import RuleInput from '@/components/conversation/RuleInput'
import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { WhenApplicable, WhenNotApplicable } from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { PlacesDesEntreprisesButton } from '@/components/PlaceDesEntreprises'
import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Message } from '@/design-system'
import { Container, Spacing } from '@/design-system/layout'
import { H2, H3, H4 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useQuestionList } from '@/hooks/useQuestionList'
import { Grid } from '@mui/material'
import Engine, { Evaluation } from 'publicodes'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData, { SimulatorData } from '../Simulateurs/metadata'
import { AutoEntrepreneurCard } from './cards/AutoEntrepeneurCard'
import { DemarcheEmbaucheCard } from './cards/DemarcheEmbauche'
import { KbisCard } from './cards/KBISCard'
import { MobiliteCard } from './cards/MobiliteCard'
import { SecuriteSocialeCard } from './cards/SecuriteSocialeCard'
import forms from './forms.svg'
import growth from './growth.svg'

const infereSimulateurRevenuFromSituation = (
	engine: Engine<DottedName>
): keyof SimulatorData | null => {
	if (
		engine.evaluate('entreprise . catégorie juridique . EI . auto-entrepreneur')
			.nodeValue
	) {
		return 'auto-entrepreneur'
	}

	if (
		engine.evaluate('entreprise . catégorie juridique . SARL . unipersonnelle')
			.nodeValue
	) {
		return 'eurl'
	}
	if (
		engine.evaluate('entreprise . catégorie juridique . SAS . unipersonnelle')
			.nodeValue
	) {
		return 'sasu'
	}
	if (
		engine.evaluate(
			'entreprise . catégorie juridique . EI . responsabilité limité'
		).nodeValue
	) {
		return 'eirl'
	}
	if (engine.evaluate('entreprise . catégorie juridique . EI').nodeValue) {
		const métierProfessionLibéral = engine.evaluate(
			'dirigeant . indépendant . PL . métier'
		).nodeValue
		switch (métierProfessionLibéral) {
			case 'avocat':
				return 'avocat'
			case 'expert-comptable':
				return 'expert-comptable'
			case 'santé . médecin':
				return 'médecin'
			case 'santé . chirurgien-dentiste':
				return 'chirurgien-dentiste'
			case 'santé . sage-femme':
				return 'sage-femme'
			case 'santé . auxiliaire médical':
				return 'auxiliaire-médical'
			case 'santé . pharmacien':
				return 'pharmacien'
		}
		if (engine.evaluate('dirigeant . indépendant . PL').nodeValue) {
			return 'profession-libérale'
		}
		return 'entreprise-individuelle'
	}
	const régimeSocial = engine.evaluate('dirigeant . régime social').nodeValue

	if (régimeSocial === 'indépendant') {
		return 'indépendant'
	}
	// TODO : assimilé-salarié
	// if (
	// 	régimeSocial === 'assimilé-salarié'
	// ) {
	// 	return 'assimilé-salarié'
	// }
	return null
}

export default function Gérer() {
	const { t, i18n } = useTranslation()
	const dirigeantSimulateur = infereSimulateurRevenuFromSituation(useEngine())
	const simulateurs = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	const engine = useEngine()
	if (!engine.evaluate('entreprise . SIREN').nodeValue) {
		return <Redirect to={sitePaths.index} />
	}
	return (
		<>
			<Helmet>
				<title>{t('gérer.titre', 'Gérer mon activité')}</title>
			</Helmet>

			<TrackPage name="accueil" />
			<PageHeader
				picture={growth}
				titre={<Trans i18nKey="gérer.titre">Gérer mon activité</Trans>}
			>
				<Intro>
					<Trans i18nKey="gérer.description">
						Vous souhaitez vous verser un revenu ou embaucher ? Vous aurez à
						payer des cotisations et des impôts. Anticipez leurs montants grâce
						aux simulateurs adaptés à votre situation.
					</Trans>
				</Intro>
				<AskCompanyMissingDetails />
				<Spacing xl />
			</PageHeader>

			<Container
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
				darkMode
			>
				<FromTop>
					<FormsImage src={forms} alt="" />
					<Spacing xs />
					<H2>Simulateurs pour votre entreprise</H2>
					<Grid container spacing={3} position="relative">
						{dirigeantSimulateur ? (
							<SimulateurCard fromGérer {...simulateurs[dirigeantSimulateur]} />
						) : (
							<Grid
								item
								md={12}
								lg={8}
								css={`
									margin-bottom: -1rem;
								`}
							>
								<Message border={false} type="info">
									<Trans i18nKey="gérer.avertissement-entreprise-non-traitée">
										<Intro>
											Il n'existe pas encore de simulateur de revenu pour votre
											type d'entreprise sur ce site.
										</Intro>
										<Body>
											Si vous souhaitez que nous développions un nouveau
											simulateur, laissez-nous message en cliquant sur le bouton
											"Faire une suggestion" en bas de cette page.
										</Body>
									</Trans>
								</Message>
							</Grid>
						)}

						<WhenApplicable dottedName="dirigeant . indépendant">
							<SimulateurCard
								fromGérer
								{...simulateurs['aide-déclaration-indépendant']}
							/>
						</WhenApplicable>
						<WhenApplicable dottedName="entreprise . imposition . IS">
							<Grid item xs={12} md={6} lg={4} alignSelf="flex-end">
								<Grid container spacing={3} columns={2}>
									<SimulateurCard fromGérer {...simulateurs['is']} small />
									<SimulateurCard
										fromGérer
										{...simulateurs['dividendes']}
										small
									/>
								</Grid>
							</Grid>
						</WhenApplicable>
					</Grid>
				</FromTop>
				<Spacing xl />
			</Container>
			{dirigeantSimulateur !== 'auto-entrepreneur' && (
				<FromTop>
					<H2>
						<Trans>Salariés et embauche</Trans>
					</H2>
					<Grid container spacing={3}>
						<SimulateurCard fromGérer {...simulateurs['salarié']} />
						<SimulateurCard fromGérer {...simulateurs['chômage-partiel']} />
					</Grid>
				</FromTop>
			)}

			<H2>
				<Trans>Ressources utiles</Trans>
			</H2>
			<Grid container spacing={3}>
				{dirigeantSimulateur === 'indépendant' && i18n.language === 'fr' && (
					<Grid item sm={12} md={4}>
						<MobiliteCard />
					</Grid>
				)}
				<WhenNotApplicable dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur">
					<Grid item sm={12} md={4}>
						<DemarcheEmbaucheCard />
					</Grid>
				</WhenNotApplicable>
				<WhenApplicable dottedName="entreprise . catégorie juridique . EI . auto-entrepreneur">
					<Grid item sm={12} md={4}>
						<AutoEntrepreneurCard />
					</Grid>
				</WhenApplicable>
				<Grid item sm={12} md={4}>
					<SecuriteSocialeCard />
				</Grid>
				<Grid item sm={12} md={4}>
					<KbisCard />
				</Grid>
			</Grid>

			<PlacesDesEntreprisesButton
				pathname="/aide-entreprise/mon-entreprise-urssaf-fr"
				siret={
					engine.evaluate('établissement . SIRET')
						.nodeValue as Evaluation<string>
				}
			/>
		</>
	)
}

const companyDetailsConfig = {
	situation: {
		'contrat salarié': 'non',
	},
	objectifs: [
		'dirigeant . régime social',
		'entreprise . imposition',
	] as DottedName[],
}
export const AskCompanyMissingDetails = () => {
	useSimulationConfig(companyDetailsConfig)

	const [questions, onQuestionAnswered] = useQuestionList()
	return (
		<>
			<CompanyDetails />
			{!!questions.length && (
				<>
					<Body
						css={`
							margin-bottom: -0.5rem;
						`}
					>
						Répondez aux questions suivantes pour découvrir les simulateurs et
						assistants adaptés à votre situation :
					</Body>

					{questions.map((question) => (
						<FromTop key={question.dottedName}>
							<H4>{question.rawNode.question}</H4>
							<RuleInput
								dottedName={question.dottedName}
								onChange={onQuestionAnswered(question.dottedName)}
							/>
						</FromTop>
					))}
				</>
			)}
		</>
	)
}

const FormsImage = styled.img`
	position: absolute;
	height: 25rem;
	transform: rotate(180deg);
	top: -1px;
	z-index: 0;

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: none;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		right: 5rem;
		height: 12rem;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.lg}) {
		right: 8.5rem;
		height: 20rem;
	}

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		right: 10rem;
		height: 23rem;
	}
`
