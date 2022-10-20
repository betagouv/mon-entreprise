import SchemeComparaison from '@/components/SchemeComparaison'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'

export default function Autoentrepreneur() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="auto-entrepreneur_ou_independant" />
			<Helmet>
				<title>{t('autoentrepreneur.page.titre', 'Auto-entrepreneur')}</title>
				<meta
					name="description"
					content={t(
						'autoentrepreneur.page.description',
						"Un auto-entrepreneur bénéficie d'un système simplifié de déclaration et de paiement, pour lesquelles les impôts et cotisations sociales sont basés sur le chiffre d'affaires réalisé chaque mois. C'est un choix intéressant si vous n'avez pas besoin de beaucoup de capital et que vous souhaitez démarrer rapidement."
					)}
				/>
			</Helmet>
			<H2>
				<Trans i18nKey="autoentrepreneur.titre">
					Entreprise individuelle ou auto-entrepreneur
				</Trans>
			</H2>
			<Trans i18nKey="autoentrepreneur.description">
				<Body>
					À la différence de l'entreprise individuelle, l'auto-entrepreneur
					bénéficie d'un régime simplifié de déclaration et de paiement : les
					cotisations sociales et l'impôt sur le revenu sont calculés sur le
					chiffre d'affaires encaissé.
				</Body>
				<Body>
					<strong>Note</strong> : Certaines activités sont exclues de ce statut
					(
					<Link
						href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions"
						aria-label={t('voir la liste sur afecreation.fr, nouvelle fenêtre')}
					>
						{' '}
						voir la liste
					</Link>
					). Certaines activités sont réglementées avec une qualification ou une
					expérience professionnelle (
					<Link
						href="https://www.afecreation.fr/pid316/activites-reglementees.html"
						aria-label={t('voir la liste sur afecreation.fr, nouvelle fenêtre')}
					>
						voir la liste
					</Link>
					).
				</Body>
			</Trans>
			<div className="ui__ full-width">
				<SchemeComparaison hideAssimiléSalarié />
			</div>
		</>
	)
}
