import SchemeComparaison from 'Components/SchemeComparaison'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'

export default function Autoentrepreneur() {
	const { t } = useTranslation()
	return (
		<>
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
			<h2>
				<Trans i18nKey="autoentrepreneur.titre">
					Entreprise individuelle ou auto-entrepreneur
				</Trans>
			</h2>
			<Trans i18nKey="autoentrepreneur.description">
				<p>
					À la différence de l'entreprise individuelle, l'auto-entrepreneur
					bénéficie d'un régime simplifié de déclaration et de paiement : les
					cotisations sociales et l'impôt sur le revenu sont calculés sur le
					chiffre d'affaires encaissé.
				</p>
				<p>
					<strong>Note</strong> : Certaines activités sont exclues de ce statut
					(
					<a href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions">
						{' '}
						voir la liste
					</a>
					). Certaines activités sont réglementées avec une qualification ou une
					expérience professionnelle (
					<a href="https://www.afecreation.fr/pid316/activites-reglementees.html">
						voir la liste
					</a>
					).
				</p>
			</Trans>
			<div className="ui__ full-width">
				<SchemeComparaison hideAssimiléSalarié />
			</div>
		</>
	)
}
