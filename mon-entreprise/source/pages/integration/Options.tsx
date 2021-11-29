import { Grid } from '@mui/material'
import PageHeader from 'Components/PageHeader'
import { icons } from 'Components/ui/SocialIcon'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Meta from '../../components/utils/Meta'
import illustration from './illustration.png'

export default function Options() {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()

	return (
		<>
			<Meta
				page="intégration"
				title="Intégration"
				description="Outils pour les développeurs"
				ogImage={illustration}
			/>
			<PageHeader
				picture={illustration}
				titre={
					<>
						<Trans>Outils pour les développeurs</Trans> <Emoji emoji="👨‍💻" />
					</>
				}
			>
				<Intro>
					<Trans i18nKey="pages.développeurs.home.description">
						En plus du site mon-entreprise.fr, nous mettons à disposition des
						outils gratuits et libres à intégrer sur votre site web. Vous pouvez
						ainsi inclure les outils créés pour <strong>mon-entreprise</strong>{' '}
						directement dans les parcours habituels de vos utilisateurs.
					</Trans>
				</Intro>
			</PageHeader>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6} xl={3}>
					<Card
						icon={<Emoji emoji="📱" />}
						title={t(
							'pages.développeurs.home.choice.iframe.title',
							'Intégrer un simulateur'
						)}
						to={sitePaths.integration.iframe}
						ctaLabel={t(
							'pages.développeurs.home.choice.iframe.cta',
							'Commencer'
						)}
					>
						<Body>
							<Trans i18nKey="pages.développeurs.home.choice.iframe.body">
								Intégrer l'un de nos simulateurs en un clic dans votre site Web,
								via un script clé en main.
							</Trans>
						</Body>
					</Card>
				</Grid>
				<Grid item xs={12} md={6} xl={3}>
					<Card
						icon={<Emoji emoji="🧰" />}
						title={t(
							'pages.développeurs.choice.library.title',
							'Libraire de calcul'
						)}
						to={sitePaths.integration.library}
						ctaLabel={t('pages.développeurs.choice.library.cta', 'Commencer')}
					>
						<Trans i18nKey="pages.développeurs.choice.library.body">
							L'intégralité du moteur de calcul socio-fiscal développé par
							l'Urssaf, mis à disposition librement sous forme de bibliothèque
							NPM.
						</Trans>
					</Card>
				</Grid>
				<Grid item xs={12} md={6} xl={3}>
					<Card
						icon={
							<svg
								viewBox="15 15 34 34"
								style={{
									width: '1rem',
									height: '1rem',
									margin: 0,
								}}
							>
								<g style={{ fill: '#030303' }}>
									<path d={icons['github'].icon} />
								</g>
							</svg>
						}
						title={t(
							'pages.développeurs.choice.github.title',
							'Contribuer sur GitHub'
						)}
						ctaLabel={t('pages.développeurs.choice.github.cta', 'Commencer')}
						href="https://github.com/betagouv/mon-entreprise"
					>
						<Trans i18nKey="pages.développeurs.choice.github.body">
							Tous nos outils sont ouverts et développés publiquement sur
							GitHub.
						</Trans>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} xl={3}>
					<Card
						icon={<Emoji emoji="📚" />}
						title={t(
							'pages.développeurs.choice.publicodes.title',
							'Publicodes'
						)}
						ctaLabel={t(
							'pages.développeurs.choice.publicodes.cta',
							'Découvrir'
						)}
						href="https://publi.codes/"
					>
						<Trans i18nKey="pages.développeurs.choice.publicodes.body">
							Nos outils sont propulsés par Publicodes, un nouveau langage pour
							encoder des algorithmes “explicables”.
						</Trans>
					</Card>
				</Grid>
			</Grid>
		</>
	)
}
