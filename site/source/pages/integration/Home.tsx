import { Trans, useTranslation } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import {
	Body,
	Card,
	Emoji,
	GithubIcon,
	Grid,
	Intro,
	Spacing,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import Meta from '../../components/utils/Meta'
import illustration from './images/illustration_code.svg'

export default function Options() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<>
			<Meta
				title={t('intégration.title', 'Intégration')}
				description={t(
					'intégration.description',
					'Outils pour les développeurs'
				)}
				ogImage={illustration}
			/>
			<PageHeader
				picture={illustration}
				titre={
					<>
						<Trans i18nKey="intégration.description">
							Outils pour les développeurs
						</Trans>{' '}
						<Emoji emoji="👨‍💻" />
					</>
				}
			>
				<Trans i18nKey="pages.développeur.home.description">
					<Intro $xxl>
						Offrez à vos utilisateurs une expérience améliorée en incorporant
						nos outils directement dans votre site.
					</Intro>
					<Body>
						Découvrez notre gamme complète de solutions pour intégrer en toute
						simplicité nos simulateurs et assistants sur votre site web.
					</Body>
				</Trans>
			</PageHeader>
			<Grid container spacing={3}>
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
						aria-label="Commencer à intégrer un simulateur"
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
						aria-label="Commencer à utiliser notre API REST"
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
						aria-label="Commencer à utiliser un tableur"
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
							'Librairie de calcul'
						)}
						to={absoluteSitePaths.développeur.library}
						ctaLabel={t('pages.développeur.choice.library.cta', 'Commencer')}
						aria-label="Commencer avec la librairie de calcul"
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
						aria-label="Découvrir Publicodes, nouvelle fenêtre"
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
							<GithubIcon style={{ width: '1.25rem', height: '1.25rem' }} />
						}
						title={t(
							'pages.développeur.choice.github.title',
							'Contribuer sur GitHub'
						)}
						ctaLabel={t('pages.développeur.choice.github.cta', 'Commencer')}
						href="https://github.com/betagouv/mon-entreprise"
						aria-label="Commencer à contribuer sur GitHub, nouvelle fenêtre"
					>
						<Trans i18nKey="pages.développeur.choice.github.body">
							Tous nos outils sont ouverts et développés publiquement sur
							GitHub.
						</Trans>
					</Card>
				</Grid>
			</Grid>
			<Spacing md />
		</>
	)
}
