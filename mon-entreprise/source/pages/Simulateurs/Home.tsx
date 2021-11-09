import { Grid } from '@mui/material'
import PageHeader from 'Components/PageHeader'
import { useIsEmbedded } from 'Components/utils/embeddedContext'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { SmallCard } from 'DesignSystem/card/SmallCard'
import { H2, H3 } from 'DesignSystem/typography/heading'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TrackPage } from '../../ATInternetTracking'
import Meta from '../../components/utils/Meta'
import simulatorSvg from './images/illustration-simulateur.svg'
import useSimulatorsData, { SimulatorData } from './metadata'

export default function Simulateurs() {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const language = useTranslation().i18n.language
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
				<Grid container spacing={2}>
					<SimulateurCard {...simulators.salarié} />
					<SimulateurCard {...simulators['chômage-partiel']} />
					<SimulateurCard {...simulators['aides-embauche']} />
				</Grid>

				<H3>
					<Trans>Revenu du dirigeant par statut</Trans>
				</H3>
				<Grid container spacing={2}>
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

				<Grid container spacing={2}>
					<SimulateurCard {...simulators.indépendant} />
					<SimulateurCard {...simulators['artiste-auteur']} />
					<SimulateurCard {...simulators['profession-libérale']} />
				</Grid>
				<>
					<H3>
						<Trans>Professions libérales</Trans>
					</H3>
					<Grid container spacing={2}>
						<SimulateurCard small {...simulators['auxiliaire-médical']} />
						<SimulateurCard small {...simulators['chirurgien-dentiste']} />
						<SimulateurCard small {...simulators.médecin} />
						<SimulateurCard small {...simulators['sage-femme']} />
						<SimulateurCard small {...simulators['pharmacien']} />
						<SimulateurCard small {...simulators['avocat']} />
						<SimulateurCard small {...simulators['expert-comptable']} />
					</Grid>
				</>

				<H2>
					<Trans>Autres outils</Trans>
				</H2>
				<Grid container spacing={2}>
					<SimulateurCard {...simulators['is']} />
					<SimulateurCard {...simulators['dividendes']} />
					{language === 'fr' && (
						<SimulateurCard {...simulators['demande-mobilité']} />
					)}
					<SimulateurCard {...simulators['économie-collaborative']} />
					<SimulateurCard {...simulators['aide-déclaration-indépendant']} />
				</Grid>
			</section>
			<section>
				<Trans i18nKey="page.simulateurs.accueil.description">
					<p>Tous les simulateurs sur ce site sont :</p>
					<ul>
						<li>
							<strong>Maintenus à jour</strong> avec les dernières évolutions
							législatives
						</li>
						<li>
							<strong>Améliorés en continu</strong> afin d'augmenter le nombre
							de dispositifs pris en compte
						</li>
						<li>
							<strong>Intégrables facilement et gratuitement</strong> sur
							n'importe quel site internet.{' '}
							<Link to={sitePaths.integration.iframe}>En savoir plus</Link>.
						</li>
					</ul>
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
	icône,
}: SimulatorData[keyof SimulatorData] & {
	small?: boolean
}) {
	const isIframe = useIsEmbedded()
	const { t } = useTranslation()

	return small ? (
		<Grid item xs={6} md={4} lg={3}>
			<SmallCard
				icon={<Emoji emoji={icône} />}
				callToAction={{
					to: {
						state: { fromSimulateurs: true },
						pathname: (isIframe && iframePath) || path,
					},
				}}
				title={shortName}
				tooltip={tooltip}
			/>
		</Grid>
	) : (
		<Grid item xs={12} md={4}>
			<Card
				title={shortName}
				icon={<Emoji emoji={icône} />}
				callToAction={{
					to: {
						state: { fromSimulateurs: true },
						pathname: (isIframe && iframePath) || path,
					},
					label: t('.cta', 'Lancer le simulateur'),
				}}
			>
				<Body>{meta?.description}</Body>
			</Card>
		</Grid>
	)
}
