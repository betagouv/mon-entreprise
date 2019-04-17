import { T } from 'Components'
import Overlay from 'Components/Overlay'
import PrivacyContent from 'Components/PrivacyContent'
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
					<T>Vie privée</T>
				</button>
				{this.state.opened && (
					<Overlay onClose={this.handleClose} style={{ textAlign: 'left' }}>
						<ScrollToTop />
						<PrivacyContent />
					</Overlay>
				)}
			</>
		)
	}
}
