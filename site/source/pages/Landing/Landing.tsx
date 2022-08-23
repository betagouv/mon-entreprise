import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import PageHeader from '@/components/PageHeader'
import Meta from '@/components/utils/Meta'
import { Button } from '@/design-system/buttons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData from '../Simulateurs/metadata'
import illustrationSvg from './illustration.svg'
import illustration2Svg from './illustration2.svg'
import SearchOrCreate from './SearchOrCreate'

export default function Landing() {
	const simulators = useSimulatorsData()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<>
			<TrackPage chapter1="informations" name="accueil" />
			<Meta
				page="landing"
				title="Mon-entreprise"
				description="L'assistant officiel des entrepreneurs"
				ogImage="/logo-share.png"
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
			<Container
				darkMode
				backgroundColor={(theme) => theme.colors.bases.primary[600]}
			>
				<SearchOrCreate />
				<Spacing xl />
			</Container>
			<Container>
				<Trans i18nKey="landing.outils">
					<H2>Les outils à votre disposition</H2>
					<Body>
						Nous mettons à votre disposition des assistants et simulateurs pour
						vous aider à la gestion de votre entreprise, anticiper les
						prélèvements et planifier votre trésorerie en conséquence.
					</Body>
				</Trans>

				<Grid
					container
					spacing={4}
					css={`
						align-items: stretch;
						justify-content: center;
					`}
				>
					<SimulateurCard {...simulators.salarié} />
					<SimulateurCard {...simulators['auto-entrepreneur']} />
					<SimulateurCard {...simulators['profession-libérale']} />

					<Grid
						item
						xs={12}
						css={`
							display: flex;
						`}
					>
						<Button
							size="XL"
							to={absoluteSitePaths.simulateurs.index}
							css={`
								white-space: no-wrap;
								margin: auto;
							`}
						>
							<Trans i18nKey="landing.choice.simulators.title">
								Découvrir tous les simulateurs et assistants
							</Trans>
						</Button>
					</Grid>
				</Grid>
				<Spacing xl />
			</Container>
			<Container backgroundColor={(theme) => theme.colors.bases.primary[100]}>
				<Spacing lg />
				<Grid
					container
					css={`
						align-items: flex-end;
					`}
				>
					<HideOnMobile item xs={2} md={2}>
						<img
							src={illustration2Svg}
							css={`
								width: 100%;
								padding-right: 2rem;
								padding-bottom: 1rem;
							`}
						/>
					</HideOnMobile>
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

const HideOnMobile = styled(Grid)`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`
