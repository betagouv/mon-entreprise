import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { Component } from 'react'

export default class Privacy extends Component {
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
					Privacy
				</button>
				{this.state.opened && (
					<Overlay onClose={this.handleClose} style={{ textAlign: 'left' }}>
						<ScrollToTop />
						<h1>Privacy</h1>
						<p>
							We do not store any personal data on our servers. All the
							information you provide (salaries, company postal code, SIREN
							etc.) is saved only on your browser. No one else can have access
							to it but you.
						</p>
						<p>
							However, we do collect anonymous statistics on site usage, which
							we use for the sole purpose of improving the service, in
							accordance with the{' '}
							<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
								recommendations of the CNIL
							</a>{' '}
							and the DPRG directive.
						</p>
						<p>You can opt out below.</p>
						<iframe
							style={{
								border: 0,
								height: '200px',
								width: '100%'
							}}
							src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=en"
						/>
					</Overlay>
				)}
			</>
		)
	}
}
