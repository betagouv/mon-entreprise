import PageHeader from '@/components/PageHeader'
import InfoBulle from '@/components/ui/InfoBulle'
import { useIsEmbedded } from '@/components/utils/embeddedContext'
import Emoji from '@/components/utils/Emoji'
import { Card } from '@/design-system/card'
import { SmallCard } from '@/design-system/card/SmallCard'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import Meta from '../../components/utils/Meta'
import simulatorSvg from './images/illustration-simulateur.svg'
import useSimulatorsData, { ExtractFromSimuData } from './metadata'

export default function Simulateurs() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()
	const simulators = useSimulatorsData()
	const titre = t('pages.simulateurs.accueil.titre', 'Simulateurs disponibles')

	return (
		<>
			<TrackPage chapter1="simulateurs" name="accueil" />
			<Meta
				page="simulateurs"
				title="simulateurs"
				description="Tous les simulateurs sur ce site sont maintenus à jour avec les dernières évolutions législatives."
				ogImage={simulatorSvg}
			/>
			<Helmet>
				<title>{titre}</title>
			</Helmet>
			<PageHeader titre={titre} picture={simulatorSvg}>
				<Intro>
					<Trans i18nKey="pages.simulateurs.accueil.header">
						Tous les simulateurs sur ce site sont maintenus à jour avec les
						dernières évolutions législatives.
					</Trans>
				</Intro>
			</PageHeader>
			<section>
				<H2>
					<Trans>Salariés et employeurs</Trans>
				</H2>
				<Grid container spacing={3}>
					<SimulateurCard {...simulators.salarié} />
					<SimulateurCard {...simulators['chômage-partiel']} />
				</Grid>

				<H3>
					<Trans>Revenu du dirigeant par statut</Trans>
				</H3>
				<Grid container spacing={3}>
					<SimulateurCard small {...simulators['auto-entrepreneur']} />
					<SimulateurCard small {...simulators['entreprise-individuelle']} />
					<SimulateurCard small {...simulators.eirl} />
					<SimulateurCard small {...simulators.sasu} />
					<SimulateurCard small {...simulators.eurl} />
					<SimulateurCard small {...simulators['comparaison-statuts']} />
				</Grid>

				<H2>
					<Trans>Travailleurs Non Salariés (TNS)</Trans>
				</H2>

				<Grid container spacing={3}>
					<SimulateurCard {...simulators.indépendant} />
					<SimulateurCard {...simulators['artiste-auteur']} />
					<SimulateurCard {...simulators['profession-libérale']} />
				</Grid>
				<>
					<H3>
						<Trans>Professions libérales</Trans>
					</H3>
					<Grid container spacing={3}>
						<SimulateurCard small {...simulators['auxiliaire-médical']} />
						<SimulateurCard small {...simulators['chirurgien-dentiste']} />
						<SimulateurCard small {...simulators.médecin} />
						<SimulateurCard small {...simulators['sage-femme']} />
						<SimulateurCard small {...simulators.pharmacien} />
						<SimulateurCard small {...simulators.avocat} />
						<SimulateurCard small {...simulators['expert-comptable']} />
					</Grid>
				</>

				<H3>
					<Trans>
						Assistants à la déclaration de revenu 2021 des indépendants
					</Trans>
				</H3>
				<Grid container spacing={3}>
					<SimulateurCard
						{...simulators['déclaration-charges-sociales-indépendant']}
					/>
					<SimulateurCard {...simulators['exonération-covid']} />
					<SimulateurCard
						{...simulators['déclaration-revenu-indépendant-beta']}
					/>
				</Grid>

				<H2>
					<Trans>Autres outils</Trans>
				</H2>
				<Grid container spacing={3}>
					<SimulateurCard {...simulators.is} />
					<SimulateurCard {...simulators.dividendes} />
					<SimulateurCard {...simulators['économie-collaborative']} />
					<SimulateurCard {...simulators['demande-mobilité']} />
				</Grid>
			</section>
			<section>
				<Trans i18nKey="page.simulateurs.accueil.description">
					<Body>Tous les simulateurs sur ce site sont :</Body>
					<Ul>
						<Li>
							<strong>Maintenus à jour</strong> avec les dernières évolutions
							législatives
						</Li>
						<Li>
							<strong>Améliorés en continu</strong> afin d'augmenter le nombre
							de dispositifs pris en compte
						</Li>
						<Li>
							<Strong>Intégrables facilement et gratuitement</Strong> sur
							n'importe quel site internet.{' '}
							<Link to={absoluteSitePaths.développeur.iframe}>
								En savoir plus
							</Link>
							.
						</Li>
					</Ul>
				</Trans>
			</section>
		</>
	)
}

export function SimulateurCard({
	small = false,
	shortName,
	meta,
	path,
	tooltip,
	iframePath,
	fromGérer = false,
	icône,
}: {
	shortName: ExtractFromSimuData<'shortName'>
	meta: ExtractFromSimuData<'meta'>
	path: ExtractFromSimuData<'path'>
	tooltip?: ExtractFromSimuData<'tooltip'>
	iframePath?: ExtractFromSimuData<'iframePath'>
	icône: ExtractFromSimuData<'icône'>
	small?: boolean
	fromGérer?: boolean
}) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()

	return (
		<ThemeProvider theme={(theme) => ({ ...theme, darkMode: false })}>
			{small ? (
				<Grid item xs={12} sm={6} md={6} lg={4}>
					<SmallCard
						icon={<Emoji emoji={icône} />}
						to={{
							pathname: (isIframe && `/iframes/${iframePath ?? ''}`) || path,
						}}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
						title={
							<h4>
								{shortName} {tooltip && <InfoBulle>{tooltip}</InfoBulle>}
							</h4>
						}
					/>
				</Grid>
			) : (
				<Grid item xs={12} sm={6} md={6} lg={4}>
					<Card
						title={shortName}
						icon={<Emoji emoji={icône} />}
						ctaLabel={t('.cta', 'Lancer le simulateur')}
						to={{ pathname: (isIframe && iframePath) || path }}
						state={fromGérer ? { fromGérer: true } : { fromSimulateurs: true }}
					>
						{meta?.description}
					</Card>
				</Grid>
			)}
		</ThemeProvider>
	)
}
