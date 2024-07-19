import { Trans, useTranslation } from 'react-i18next'

import { PopoverWithTrigger } from '@/design-system'
import { H2 } from '@/design-system/typography/heading'
import { Link, StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

export default function LegalNotice() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline>
					{t('legalNotice.title', 'Mentions légales')}
				</Link>
			)}
			title={t('legalNotice.title', 'Mentions légales')}
			small
		>
			<H2>{t('legalNotice.editeur.title', 'Editeur de la Plateforme')}</H2>
			<Body>
				<Trans i18nKey="legalNotice.editeur.content">
					La plateforme mon-entreprise.urssaf.fr est éditée par l'Agence
					Centrale des Organismes de Sécurité Sociale (également appelée « Acoss
					» ou « Urssaf Caisse nationale ») située : <br />
					36 rue de Valmy <br />
					93108 Montreuil Cedex <br />
					01 77 93 65 00 <br />
					<StyledLink
						href="mailto:webmaster.general@acoss.fr"
						aria-label={t(
							'legalNotice.editeur.label',
							'Envoyer un mail à webmaster.general@acoss.fr'
						)}
						target="_blank"
						rel="noreferrer"
					>
						webmaster.general@acoss.fr
					</StyledLink>
				</Trans>
			</Body>
			<H2>
				{t('legalNotice.publication.title', 'Directeur de la publication')}
			</H2>
			<Body>
				{t(
					'legalNotice.publication.content',
					"M. Damien IENTILE, Directeur de l'Urssaf Caisse nationale"
				)}
			</Body>
			<H2>{t('legalNotice.hosting.title', "Prestataire d'hébergement")}</H2>
			<Body>
				<Trans i18nKey="legalNotice.hosting.content">
					Ce site est hébergé par Netlify : <br />
					610 22nd Street, Suite 315 <br />
					San Francisco, CA 94107 <br />
					États-Unis d'Amérique <br />
					+1 844-899-7312
				</Trans>
			</Body>
			<H2>{t('legalNotice.accessibility.title', 'Accessibilité')}</H2>
			<Body>
				<Trans i18nKey="legalNotice.accessibility.content">
					La plateforme est{' '}
					<StyledLink
						href="https://mon-entreprise.urssaf.fr/accessibilit%C3%A9"
						aria-label={t(
							'legalNotice.accessibility.label',
							'Aller à la page https://mon-entreprise.urssaf.fr/accessibilit%C3%A9, nouvel onglet'
						)}
						target="_blank"
						rel="noreferrer"
					>
						partiellement conforme
					</StyledLink>{' '}
					aux normes d’accessibilité numérique. Nous tâchons de rendre cette
					plateforme accessible à toutes et à tous.
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="legalNotice.contact.title">Contact</Trans>
			</H2>
			<Body>
				<Trans i18nKey="legalNotice.contact.content">
					<StyledLink
						href="mailto:contact@mon-entreprise.beta.gouv.fr"
						aria-label={t(
							'legalNotice.contact.label',
							'Envoyer un mail à contact@mon-entreprise.beta.gouv.fr'
						)}
						target="_blank"
						rel="noreferrer"
					>
						contact@mon-entreprise.beta.gouv.fr
					</StyledLink>
				</Trans>
			</Body>{' '}
		</PopoverWithTrigger>
	)
}
