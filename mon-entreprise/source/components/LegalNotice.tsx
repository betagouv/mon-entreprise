import Overlay from 'Components/Overlay'
import { H1, H2 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useState } from 'react'
import { Trans } from 'react-i18next'

export const LegalNoticeContent = () => (
	<>
		<H1>
			<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
		</H1>
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
		</Body>
	</>
)

export default function LegalNotice() {
	const [opened, setOpened] = useState(false)
	const handleClose = () => {
		setOpened(false)
	}
	const handleOpen = () => {
		setOpened(true)
	}

	return (
		<>
			<Link onClick={handleOpen}>
				<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
			</Link>
			{opened && (
				<Overlay onClose={handleClose} style={{ textAlign: 'left' }}>
					<LegalNoticeContent />
				</Overlay>
			)}
		</>
	)
}
