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
							<PrivacyContent language={this.props.language} />
						</Overlay>
					)}
				</>
			)
		}
	}
)

export let PrivacyContent = ({ language }) => (
	<>
		<T k="privacyContent">
			<h1>Vie privée</h1>
			<p>
				Nous recueillons des statistiques anonymes sur l'utilisation du site,
				que nous utilisons dans le seul but d'améliorer le service, conformément
				aux{' '}
				<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
					recommandations de la CNIL
				</a>{' '}
				et au règlement RGPD. Ce sont les seules données qui quittent votre
				navigateur.
			</p>
			<p>
				Vous pouvez vous soustraire de cette mesure d'utilisation du site
				ci-dessous.
			</p>
		</T>
		<iframe
			style={{
				border: 0,
				height: '200px',
				width: '100%'
			}}
			src={`https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=${language}`}
		/>
	</>
)
