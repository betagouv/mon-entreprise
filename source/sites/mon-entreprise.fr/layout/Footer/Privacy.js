import { T } from 'Components'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import React, { Component } from 'react'

export default withLanguage(
	class Privacy extends Component {
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
						<T>Vie privée</T>
					</button>
					{this.state.opened && (
						<Overlay onClose={this.handleClose} style={{ textAlign: 'left' }}>
							<ScrollToTop />
							<T k="privacyContent">
								<h1>Vie privée</h1>
								<p>
									Nous ne stockons aucune donnée personnelle sur nos serveurs.
									Toutes les informations que vous fournissez (salaires, code
									postal de l'entreprise, SIREN etc.) sont sauvegardées
									uniquement sur votre navigateur. Personne d'autre que vous ne
									peut y avoir accès.
								</p>
								<p>
									Toutefois, nous recueillons des statistiques anonymes sur
									l'utilisation du site, que nous utilisons dans le seul but
									d'améliorer le service, conformément aux{' '}
									<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
										recommandations de la CNIL
									</a>{' '}
									et à la directive RGPD.
								</p>
								<p>Vous pouvez vous en soustraire ci-dessous.</p>
							</T>
							<iframe
								style={{
									border: 0,
									height: '200px',
									width: '100%'
								}}
								src={`https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=${language}`}
							/>
						</Overlay>
					)}
				</>
			)
		}
	}
)
