import { Article } from 'DesignSystem/card'
import { Trans, useTranslation } from 'react-i18next'
import { DirigeantOrNull } from '../Home'

type KbisCardProps = {
	dirigeant: DirigeantOrNull
}

export function KbisCard({ dirigeant }: KbisCardProps) {
	const { t, i18n } = useTranslation()

	if (dirigeant === 'auto-entrepreneur') {
		return (
			<Article
				title={t(
					'gérer.ressources.kbis-autoentrepreneur.title',
					'Récupérer un extrait de Kbis?'
				)}
				href={`https://www.service-public.fr/professionnels-entreprises/vosdroits/F21000${
					i18n.language === 'fr' ? '' : '?lang=en'
				}`}
				ctaLabel={t(
					'gérer.ressources.kbis-autoentrepreneur.cta',
					'Visiter le site'
				)}
			>
				<Trans i18nKey="gérer.ressources.kbis-autoentrepreneur.body">
					Les auto-entrepreneurs n'ont pas de Kbis. Ils peuvent cependant
					récupérer et présenter un extrait K. Voir le site du service-public
					pour plus d'informations.
				</Trans>
			</Article>
		)
	}

	return (
		<Article
			title={t('gérer.ressources.kbis.title', 'Récupérer un extrait de Kbis')}
			ctaLabel={t('gérer.ressources.kbis.cta', 'Aller sur monIdeNum.fr')}
			href="https://www.monidenum.fr"
		>
			<Trans i18nKey="gérer.ressources.kbis.body">
				Le Kbis est un document permettant de justifier de l'enregistrement de
				l'entreprise au{' '}
				<abbr title="Registre du Commerce et des Sociétés">RCS</abbr> et de
				prouver son existence légale. Ce document peut être récupéré
				gratuitement pour votre entreprise via le site MonIdeNum.
			</Trans>
		</Article>
	)
}
