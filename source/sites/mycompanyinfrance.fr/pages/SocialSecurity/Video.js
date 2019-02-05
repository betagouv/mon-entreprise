import withLanguage from 'Components/utils/withLanguage'
import React, { Component } from 'react'

export default withLanguage(
	class Video extends Component {
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
			)
		}
	}
)
