import React, { Component } from 'react'
import { slide as Menu } from 'react-burger-menu'
import 'Components/pages/Menu.css'
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
				<Menu right>
					<Link className="menu-item" to="/">
						Accueil
					</Link>
					<Link className="menu-item" to="/à-propos">
						À propos
					</Link>
					<Link className="menu-item" to="/intégrer">
						Intégrer le module
					</Link>
					<Link className="menu-item" to="/contribuer">
						Contribuer
					</Link>
					<Link className="menu-item" to="/regles">
						Toutes nos règles
					</Link>
				</Menu>
			</div>
		)
	}
}
