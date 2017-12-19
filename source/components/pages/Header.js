import React, { Component } from 'react'
import 'Components/pages/Header.css'
import { Link } from 'react-router-dom'

export default class Header extends Component {
	state = {
		mobileNavVisible: false
	}
	togglemobileNavVisible = () =>
		this.setState({ mobileNavVisible: !this.state.mobileNavVisible })

	render() {
		let displayHeader = !['/simu/', '/regle/'].find(
			t => window.location.href.toString().includes(t)
		)
		if (!displayHeader) return null

		return (
			<div id="header">
				<Link id="brand" to="/">
					<img
						id="marianne"
						src={require('Images/marianne.svg')}
						alt="Un service de l'État français"
					/>
					<h1>Simulateur d'embauche</h1>
				</Link>
				<div id="menuButton">
					{this.state.mobileNavVisible ? (
						<i
							className="fa fa-times"
							aria-hidden="true"
							onClick={this.togglemobileNavVisible}
						/>
					) : (
						<i
							className="fa fa-bars"
							aria-hidden="true"
							onClick={this.togglemobileNavVisible}
						/>
					)}
				</div>
				<nav className={this.state.mobileNavVisible ? 'visible' : ''}>
					<Links toggle={this.togglemobileNavVisible} />
				</nav>
			</div>
		)
	}
}

let Links = ({toggle}) => (
	<div id="links" onClick={toggle}>
		<Link className="menu-item" to="/intégrer">
			Intégrer le module
		</Link>
		<Link className="menu-item" to="/contribuer">
			Contribuer
		</Link>
		<Link className="menu-item" to="/regles">
			Toutes nos règles
		</Link>
		<Link className="menu-item" to="/à-propos">
			À propos
		</Link>
	</div>
)
