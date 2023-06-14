import { Trans, useTranslation } from 'react-i18next'

import { Message, PopoverWithTrigger } from '@/design-system'
import { H2 } from '@/design-system/typography/heading'
import { Link, StyledLink } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

export default function Contact() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline>
					<Trans i18nKey="contact.title">Nous contacter</Trans>
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
				<Trans i18nKey="contact.info">
					<Body>
						Nous sommes une petite équipe uniquement affectée au développement
						du site mon-entreprise.urssaf.fr et des simulateurs associés.
						<br />
						Par conséquent, nous n'avons pas accès à la situation personnelle
						des cotisants (pour des raisons de confidentialité), et nous ne
						pouvons légalement pas donner de conseil sur une situation
						spécifique.
					</Body>
				</Trans>
			</Message>
			<Trans i18nKey="contact.urssaf">
				<Body>
					Si vous souhaitez contacter votre Urssaf, vous pouvez utiliser les
					canaux habituels :
				</Body>
				<Ul>
					<Li>
						par téléphone :{' '}
						<Link href="https://www.urssaf.fr/portail/home/votre-urssaf/contacts-telephoniques.html">
							www.urssaf.fr/portail/home/votre-urssaf/contacts-telephoniques.html
						</Link>
					</Li>
					<Li>
						par message :{' '}
						<Link href="https://www.contact.urssaf.fr">
							www.contact.urssaf.fr
						</Link>
					</Li>
				</Ul>
			</Trans>
		</PopoverWithTrigger>
	)
}
