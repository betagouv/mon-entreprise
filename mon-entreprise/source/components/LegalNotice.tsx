import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'

export default function LegalNotice() {
	const { t } = useTranslation()
	return (
		<PopoverWithTrigger
			trigger={
				<Link>
					<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
				</Link>
			}
			title={t('legalNotice.title', 'Mentions légales')}
		>
			<H2>
				<Trans i18nKey="legalNotice.editeur.title">Editeur</Trans>
			</H2>
			<Body>
				Agence Centrale des Organismes de Sécurité Sociale (ACOSS)
				<br />
				36 rue de Valmy - 93108 Montreuil Cedex
			</Body>
			<H2>
				<Trans i18nKey="legalNotice.publication.title">
					Directeur de la publication
				</Trans>
			</H2>
			<Body>
				<Trans i18nKey="legalNotice.publication.content">
					M. Yann-Gaël Amghar, Directeur de l'Acoss
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="legalNotice.hosting.title">
					Prestataire d'hébergement
				</Trans>
			</H2>
			<Body>
				<Trans i18nKey="legalNotice.hosting.content">
					Netlify
					<br />
					610 22nd Street, Suite 315,
					<br />
					San Francisco, CA 94107 <br />
					Site web :&nbsp;
					<a href="https://www.netlify.com" target="_blank">
						https://www.netlify.com
					</a>
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="legalNotice.contact.title">Contact</Trans>
			</H2>
			<Body>
				<Trans i18nKey="legalNotice.contact.content">
					<a target="_blank" href="mailto:contact@mon-entreprise.beta.gouv.fr">
						contact@mon-entreprise.beta.gouv.fr
					</a>
				</Trans>
			</Body>{' '}
		</PopoverWithTrigger>
	)
}
