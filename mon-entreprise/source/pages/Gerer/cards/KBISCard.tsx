import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { DirigeantOrNull } from '../Home'

type KbisCardProps = {
	dirigeant: DirigeantOrNull
}

export function KbisCard({ dirigeant }: KbisCardProps) {
	const { t, i18n } = useTranslation()

	if (dirigeant === 'auto-entrepreneur') {
		return (
			<Card
				title={t(
					'gérer.ressources.kbis-autoentrepreneur.title',
					'Récupérer un extrait de Kbis?'
				)}
				callToAction={{
					href: `https://www.service-public.fr/professionnels-entreprises/vosdroits/F21000${
						i18n.language === 'fr' ? '' : '?lang=en'
					}`,
					label: t(
						'gérer.ressources.kbis-autoentrepreneur.cta',
						'Visiter le site'
					),
				}}
			>
				<Body>
					<Trans i18nKey="gérer.ressources.kbis-autoentrepreneur.body">
						Les auto-entrepreneurs n'ont pas de Kbis. Ils peuvent cependant
						récupérer et présenter un extrait K. Voir le site du service-public
						pour plus d'informations.
					</Trans>
				</Body>
			</Card>
		)
	}

	return (
		<Card
			title={t('gérer.ressources.kbis.title', 'Récupérer un extrait de Kbis')}
			callToAction={{
				href: 'https://www.monidenum.fr',
				label: t('gérer.ressources.kbis.cta', 'Aller sur monIdeNum.fr'),
			}}
		>
			<Body>
				<Trans i18nKey="gérer.ressources.kbis.body">
					Le Kbis est un document permettant de justifier de l'enregistrement de
					l'entreprise au{' '}
					<abbr title="Registre du Commerce et des Sociétés">RCS</abbr> et de
					prouver son existence légale. Ce document peut être récupéré
					gratuitement pour votre entreprise via le site MonIdeNum.
				</Trans>
			</Body>
		</Card>
	)
}
