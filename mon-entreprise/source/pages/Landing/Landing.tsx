import { Grid } from '@mui/material'
import CompanyDetails from 'Components/CompanyDetails'
import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import PageHeader from 'Components/PageHeader'
import { Appear } from 'Components/ui/animate'
import CardSelection from 'Components/ui/CardSelection'
import Emoji from 'Components/utils/Emoji'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card/Card'
import { Container, Spacing } from 'DesignSystem/layout'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import logoSvg from 'Images/logo.svg'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData from '../Simulateurs/metadata'
import illustrationSvg from './illustration.svg'
import illustration2Svg from './illustration2.svg'
import './Landing.css'
import SearchOrCreate from './SearchOrCreate'

export default function Landing() {
	const { t } = useTranslation()
	const simulators = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)

	return (
		<>
			<TrackPage chapter1="informations" name="accueil" />
			<Meta
				page="landing"
				title="Mon-entreprise"
				description="L'assistant officiel des entrepreneurs"
				ogImage={logoSvg}
			/>
			<Header />
			<Container>
				<PageHeader
					titre={
						<Trans i18nKey="landing.title">
							L'assistant officiel des entrepreneurs
						</Trans>
					}
					picture={illustrationSvg}
				>
					<Intro>
						<Trans i18nKey="landing.subtitle">
							Les ressources nécessaires pour développer votre activité, du
							statut juridique à l'embauche.
						</Trans>
					</Intro>
				</PageHeader>
			</Container>

			<Container>
				{company && (
					<Appear>
						<h2 className="ui__ h h4">
							<Trans i18nKey="landing.choice.continue">
								Continuer avec l'entreprise
							</Trans>
						</h2>
						<CardSelection to={sitePaths.gérer.index}>
							<CompanyDetails {...company} />
						</CardSelection>
						<br />
					</Appear>
				)}
				<SearchOrCreate />
			</Container>
			<Container>
				<Trans i18nKey="landing.outils">
					<h2>Les outils à votre disposition</h2>
					<p>
						Nous mettons à votre disposition des assistants et simulateurs pour
						vous aider à la gestion de votre entreprise, anticiper les
						prélèvements et planifier votre trésorerie en conséquence.
					</p>
				</Trans>
				<div className="ui__ box-container">
					<SimulateurCard {...simulators.salarié} />
					<SimulateurCard {...simulators['auto-entrepreneur']} />
					<SimulateurCard {...simulators['profession-libérale']} />
				</div>
				<div
					css={`
						text-align: center;
						margin-top: 1rem;
					`}
				>
					<Link
						to={sitePaths.simulateurs.index}
						className="ui__  simple small button"
					>
						<Trans i18nKey="landing.outils_cta">
							<Emoji emoji={'🧮'} /> Découvrir tous les simulateurs et
							assistants
						</Trans>
					</Link>
				</div>
			</Container>

			<Container backgroundColor={(theme) => theme.colors.bases.primary[500]}>
				<Spacing xl />
				<Grid container spacing={4} alignItems="stretch">
					<Grid item lg={4} sm={6}>
						<Card
							icon={<Emoji emoji="💡" />}
							title={t('landing.choice.create.title', 'Créer une entreprise')}
							ctaLabel={statutChoisi ? t('Continuer') : t('Commencer')}
							to={
								statutChoisi
									? sitePaths.créer[statutChoisi]
									: sitePaths.créer.index
							}
						>
							<Trans i18nKey="landing.choice.create.body">
								Un accompagnement au choix du statut juridique et la liste
								complète des démarches de création
							</Trans>
						</Card>
					</Grid>
					<Grid item lg={4} sm={6}>
						<Card
							icon={<Emoji emoji="💶" />}
							title={t('landing.choice.manage.title', 'Gérer mon activité')}
							ctaLabel={t('Commencer')}
							to={sitePaths.gérer.index}
						>
							<Trans i18nKey="landing.choice.manage.body">
								Des outils personnalisés pour anticiper le montant des
								cotisations sociales à payer et mieux gérer votre trésorerie.
							</Trans>
						</Card>
					</Grid>
					<Grid item lg={4} sm={6}>
						<Card
							icon={<Emoji emoji="🧮" />}
							title={t(
								'landing.choice.simulators.title',
								'Accéder aux simulateurs'
							)}
							ctaLabel={t('Découvrir')}
							to={sitePaths.simulateurs.index}
						>
							<Trans i18nKey="landing.choice.simulators.body">
								La liste exhaustive de tous les simulateurs disponibles sur le
								site.
							</Trans>
						</Card>
					</Grid>
				</Grid>
				<Spacing xl />
			</Container>
			<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
				<Spacing lg />
				<Grid container alignItems="flex-end">
					<Grid
						item
						xs={2}
						md={2}
						sx={{ display: { xs: 'none', md: 'block' } }}
					>
						<img
							src={illustration2Svg}
							css={`
								width: 100%;
								padding-right: 2rem;
								padding-bottom: 1rem;
							`}
						/>
					</Grid>
					<Grid item md={10}>
						<Trans i18nKey="landing.aboutUs">
							<H2>Qui sommes-nous ?</H2>
							<Body>
								Nous sommes une petite{' '}
								<Link href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe">
									équipe
								</Link>{' '}
								autonome et pluridisciplinaire au sein de l’
								<Link href="https://www.urssaf.fr">Urssaf</Link>. Nous avons à
								cœur d’être au près de vos besoins afin d’améliorer en
								permanence ce site conformément à l'approche{' '}
								<Link href="https://beta.gouv.fr/approche/manifeste">
									beta.gouv.fr
								</Link>
								.
							</Body>
							<Body>
								Nous avons développé ce site pour accompagner les créateurs
								d’entreprise dans le développement de leur activité.
							</Body>

							<Body>
								Notre objectif est de lever toutes les incertitudes vis à vis de
								l’administration afin que vous puissiez vous concentrer sur ce
								qui compte : votre activité.
							</Body>
						</Trans>
					</Grid>
				</Grid>
				<Spacing lg />
			</Container>
			<Footer />
		</>
	)
}
