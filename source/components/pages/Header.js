import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import 'Components/pages/Header.css'
import { Link } from 'react-router-dom'

export default class Header extends Component {
	render() {
		return (
			<div id="header">
				<Link className="menu-item" to="/">
					<img
						id="marianne"
						src={require('Images/marianne.svg')}
						alt="Un service de l'État français"
					/>
				</Link>
				<nav>
					<Menu right>
						<Links />
					</Menu>
					{/* Et maintenant le menu pour grand écran, activé en CSS */}
					<Links />
				</nav>
			</div>
		)
	}
}

let Links = () => <>
	<Link className="menu-item" to="/">
		<i className="fa fa-home" aria-hidden="true"></i>
	</Link>
	<Link className="menu-item" to="/intégrer">
		<em>Intégrer le module</em>
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
</>
