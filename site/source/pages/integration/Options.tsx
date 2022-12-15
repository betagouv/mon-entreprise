import { Trans, useTranslation } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { icons } from '@/components/ui/SocialIcon'
import { Card } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'
import { Grid } from '@/design-system/layout'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

import Meta from '../../components/utils/Meta'
import illustration from './_images/illustration_code.svg'

export default function Options() {
	const { absoluteSitePaths } = useSitePaths()
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
					<Trans i18nKey="pages.développeur.home.description">
						En plus du site mon-entreprise, nous mettons à disposition des
						outils gratuits et libres à intégrer sur votre site web. Vous pouvez
						ainsi inclure les outils créés pour <strong>mon-entreprise</strong>{' '}
						directement dans les parcours habituels de vos utilisateurs.
					</Trans>
				</Intro>
			</PageHeader>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={<Emoji emoji="📱" />}
						title={t(
							'pages.développeur.home.choice.iframe.title',
							'Intégrer un simulateur'
						)}
						to={absoluteSitePaths.développeur.iframe}
						ctaLabel={t(
							'pages.développeur.home.choice.iframe.cta',
							'Commencer'
						)}
						bodyAs="div"
					>
						<Body>
							<Trans i18nKey="pages.développeur.home.choice.iframe.body">
								Intégrer l'un de nos simulateurs en un clic dans votre site Web,
								via un script clé en main.
							</Trans>
						</Body>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={<Emoji emoji="👩‍💻" />}
						title={t(
							'pages.développeur.home.choice.api.title',
							'Utiliser notre API REST'
						)}
						to={absoluteSitePaths.développeur.api}
						ctaLabel={t('pages.développeur.home.choice.api.cta', 'Commencer')}
						bodyAs="div"
					>
						<Body>
							<Trans i18nKey="pages.développeur.home.choice.api.body">
								Utilisez nos simulateurs via notre API ouverte dans vos
								différents services.
							</Trans>
						</Body>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={<Emoji emoji="📝" />}
						title={t(
							'pages.développeur.home.choice.spreadsheet.title',
							'Utiliser avec un tableur'
						)}
						to={absoluteSitePaths.développeur.spreadsheet}
						ctaLabel={t(
							'pages.développeur.home.choice.spreadsheet.cta',
							'Commencer'
						)}
						bodyAs="div"
					>
						<Body>
							<Trans i18nKey="pages.développeur.home.choice.spreadsheet.body">
								Utilisez nos simulateurs dans vos fichiers Excel/Sheets.
							</Trans>
						</Body>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={<Emoji emoji="🧰" />}
						title={t(
							'pages.développeur.choice.library.title',
							'Libraire de calcul'
						)}
						to={absoluteSitePaths.développeur.library}
						ctaLabel={t('pages.développeur.choice.library.cta', 'Commencer')}
					>
						<Trans i18nKey="pages.développeur.choice.library.body">
							L'intégralité du moteur de calcul socio-fiscal développé par
							l'Urssaf, mis à disposition librement sous forme de bibliothèque
							NPM.
						</Trans>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={<Emoji emoji="📚" />}
						title={t('pages.développeur.choice.publicodes.title', 'Publicodes')}
						ctaLabel={t('pages.développeur.choice.publicodes.cta', 'Découvrir')}
						href="https://publi.codes/"
					>
						<Trans i18nKey="pages.développeur.choice.publicodes.body">
							Nos outils sont propulsés par Publicodes, un nouveau langage pour
							encoder des algorithmes “explicables”.
						</Trans>
					</Card>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Card
						icon={
							<svg
								viewBox="15 15 34 34"
								style={{
									width: '1rem',
									height: '1rem',
									margin: 0,
								}}
								aria-hidden
								role="img"
							>
								<g style={{ fill: '#030303' }}>
									<path d={icons.github.icon} />
								</g>
							</svg>
						}
						title={t(
							'pages.développeur.choice.github.title',
							'Contribuer sur GitHub'
						)}
						ctaLabel={t('pages.développeur.choice.github.cta', 'Commencer')}
						href="https://github.com/betagouv/mon-entreprise"
					>
						<Trans i18nKey="pages.développeur.choice.github.body">
							Tous nos outils sont ouverts et développés publiquement sur
							GitHub.
						</Trans>
					</Card>
				</Grid>
			</Grid>
		</>
	)
}
