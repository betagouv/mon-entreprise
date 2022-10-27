import SchemeComparaison from '@/components/SchemeComparaison'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import { H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'

export default function DefineDirectorStatus() {
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="independant_ou_assimile-salarie" />
			<DefaultHelmet>
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
			</DefaultHelmet>
			<H2>
				<Trans i18nKey="statut du dirigeant.titre">
					Définir le statut du dirigeant
				</Trans>
			</H2>
			<Trans i18nKey="statut du dirigeant.description">
				<Body>
					Ce choix est important car il détermine le régime de sécurité sociale
					et la couverture sociale du dirigeant. Le montant et les modalités de
					paiement des cotisations sociales sont également impactés.
				</Body>
				<div className="ui__ full-width">
					<SchemeComparaison hideAutoEntrepreneur />
				</div>
			</Trans>
		</>
	)
}
