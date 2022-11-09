import { PopoverWithTrigger } from '@/design-system'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans, useTranslation } from 'react-i18next'
import { useDarkMode } from '@/hooks/useDarkMode'

export default function LegalNotice() {
	const { t } = useTranslation()
	const [darkMode] = useDarkMode()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog">
					<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
				</Link>
			)}
			title={t('legalNotice.title', 'Mentions légales')}
			small
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
					<a
						href="https://www.netlify.com"
						aria-label="https://www.netlify.com, nouvelle fenêtre"
						target="_blank"
						rel="noreferrer"
						style={darkMode ? { color: '#9EBBF1' } : { color: '#2E5FB6' }}
					>
						https://www.netlify.com
					</a>
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="legalNotice.contact.title">Contact</Trans>
			</H2>
			<Body>
				<Trans i18nKey="legalNotice.contact.content">
					<a
						href="mailto:contact@mon-entreprise.beta.gouv.fr"
						target="_blank"
						rel="noreferrer"
						style={darkMode ? { color: '#9EBBF1' } : { color: '#2E5FB6' }}
					>
						contact@mon-entreprise.beta.gouv.fr
					</a>
				</Trans>
			</Body>{' '}
		</PopoverWithTrigger>
	)
}
