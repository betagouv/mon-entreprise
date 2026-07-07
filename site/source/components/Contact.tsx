import { Trans, useTranslation } from 'react-i18next'

import {
	Body,
	Link,
	Message,
	PopoverWithTrigger,
	StyledLink,
} from '@/design-system/index'

export default function Contact() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline>
					{t('contact.title', 'Nous contacter')}
				</Link>
			)}
			title={t('contact.title', 'Nous contacter')}
			small
		>
			<Trans i18nKey="contact.email">
				<Body>
					Vous pouvez nous contacter via notre module de retours via le boutton
					👋 en haut à droite de votre ecran ou directement par mail à l'adresse
					suivante :{' '}
					<StyledLink
						href="mailto:contact@mon-entreprise.beta.gouv.fr"
						target="_blank"
						rel="noreferrer"
					>
						contact@mon-entreprise.beta.gouv.fr
					</StyledLink>
				</Body>
			</Trans>
			<Message type="info" icon>
				<Body>
					{t(
						'contact.info',
						"Nous n'avons pas accès à la situation personnelle des cotisants (pour des raisons de confidentialité), et nous ne pouvons légalement pas donner de conseil sur une situation spécifique."
					)}
				</Body>
			</Message>
			<Body>
				<Trans i18nKey="contact.urssaf">
					Pour une question sur votre situation ou une démarche à effectuer,
					nous vous invitons à{' '}
					<Link
						href="https://www.urssaf.fr/accueil/contacter-urssaf.html"
						aria-label="contacter directement un conseiller de l'Urssaf, nouvelle fenêtre"
						target="_blank"
						rel="noreferrer"
					>
						contacter directement un conseiller de l'Urssaf
					</Link>
					qui pourra vous renseigner.
				</Trans>
			</Body>
		</PopoverWithTrigger>
	)
}
