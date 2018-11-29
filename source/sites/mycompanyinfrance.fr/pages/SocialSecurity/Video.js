import { T } from 'Components'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import React, { Component } from 'react'
import emoji from 'react-easy-emoji'

export default class Video extends Component {
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
					<T k="sécu.video">La sécurité sociale en vidéo</T>
					{emoji(' 📽️')}
				</button>
				{this.state.opened && (
					<Overlay onClose={this.handleClose} style={{ textAlign: 'left' }}>
						<ScrollToTop />
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '0',
								paddingBottom: '56.25%'
							}}>
							<iframe
								style={{
									position: 'absolute',
									top: '1em',
									left: 0,
									width: '100%',
									height: '100%'
								}}
								src={`https://www.youtube-nocookie.com/embed/${
									this.props.language === 'fr' ? 'EMQ3fNyMxBE' : 'dN9ZVazSmpc'
								}?rel=0&amp;showinfo=0`}
								frameBorder="0"
								allow="autoplay; encrypted-media"
								allowFullScreen
							/>
						</div>
					</Overlay>
				)}
			</>
		)
	}
}
