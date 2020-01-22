import SchemeComparaison from 'Components/SchemeComparaison'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'

export default function DefineDirectorStatus() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t('statut du dirigeant.titre', 'Définir le statut du dirigeant')}
				</title>
				<meta
					name="description"
					content={t(
						'statut du dirigeant.page.description',
						"Ce choix est important parce qu'il détermine le régime de sécurité sociale et la couverture sociale de l'administrateur. Chaque option a des implications juridiques et conduit à un statut différent lors de la création de votre entreprise."
					)}
				/>
			</Helmet>
			<h2>
				<Trans i18nKey="statut du dirigeant.titre">
					Définir le statut du dirigeant
				</Trans>
			</h2>
			<Trans i18nKey="statut du dirigeant.description">
				<p>
					Ce choix est important car il détermine le régime de sécurité sociale
					et la couverture sociale du dirigeant. Le montant et les modalités de
					paiement des cotisations sociales sont également impactés.
				</p>
				<div className="ui__ full-width">
					<SchemeComparaison hideAutoEntrepreneur />
				</div>
			</Trans>
		</>
	)
}
