import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { Component } from 'react'
import { Trans, withTranslation } from 'react-i18next'

export const LegalNoticeContent = withTranslation()(() => (
	<>
		<h1>
			<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
		</h1>
		<h2>
			<Trans i18nKey="legalNotice.editeur.title">Editeur</Trans>
		</h2>
		<p>
			<Trans i18nKey="legalNotice.editeur.content">
				Incubateur des services numériques,
				<br />
				Direction interministérielle du numérique et du système d'information et
				de communication de l'Etat (DINSIC),
				<br />
				Services du Premier ministre.
			</Trans>
		</p>
		<h2>
			<Trans i18nKey="legalNotice.publication.title">
				Directeur de la publication
			</Trans>
		</h2>
		<p>
			<Trans i18nKey="legalNotice.publication.content">
				M. Yann-Gaël Amghar, Directeur de l'Acoss
			</Trans>
		</p>
		<h2>
			<Trans i18nKey="legalNotice.hosting.title">
				Prestataire d'hébergement
			</Trans>
		</h2>
		<p>
			<Trans i18nKey="legalNotice.hosting.content">
				Netlify
				<br />
				610 22nd Street, Suite 315,
				<br />
				San Francisco, CA 94107 <br />
				Site web :&nbsp;
				<a href="https://www.netlify.com">https://www.netlify.com</a>
			</Trans>
		</p>
		<h2>
			<Trans i18nKey="legalNotice.contact.title">Contact</Trans>
		</h2>
		<p>
			<Trans i18nKey="legalNotice.contact.content">
				<a href="mailto:contact@embauche.beta.gouv.fr">
					contact@embauche.beta.gouv.fr
				</a>
			</Trans>
		</p>
	</>
))

export default class LegalNotice extends Component {
	state = {
		opened: false
	}
	handleClose = () => {
		this.setState({ opened: false })
	}
	handleOpen = () => {
		this.setState({ opened: true })
	}
	render() {
		return (
			<>
				<button onClick={this.handleOpen} className="ui__ link-button">
					<Trans i18nKey="legalNotice.title">Mentions légales</Trans>
				</button>
				{this.state.opened && (
					<Overlay onClose={this.handleClose} style={{ textAlign: 'left' }}>
						<ScrollToTop />
						<LegalNoticeContent />
					</Overlay>
				)}
			</>
		)
	}
}
