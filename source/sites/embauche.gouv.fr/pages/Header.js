import LangSwitcher from 'Components/LangSwitcher'
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { withI18n } from 'react-i18next'
import Logo from '../images/logo/logo-simulateur.svg'
import './Header.css'
import { compose } from 'ramda';

export const Header = compose(
	withRouter,
	withI18n()
)(
	class Header extends Component {
		state = {
			mobileNavVisible: false
		}
		togglemobileNavVisible = () =>
			this.setState({ mobileNavVisible: !this.state.mobileNavVisible })

		render() {
			return (
				<div id="header">
					<Link id="brand" to="/">
						<img id="logo" src={Logo} alt="Un service de l'État français" />
						<h1>
							Simulateur
							<br />
							d'embauche
						</h1>
					</Link>
					<div id="headerRight">
						<nav className={this.state.mobileNavVisible ? 'visible' : ''}>
							<Links toggle={this.togglemobileNavVisible} />
						</nav>
						<LangSwitcher className="menu-item ui__ link-button" />
						<span id="menuButton">
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
						</span>
					</div>
				</div>
			)
		}
	}
)
let Links = ({ toggle }) => (
	<div id="links" onClick={toggle}>
		<Link className="menu-item" to="/exemples">
			Exemples
		</Link>
		<Link className="menu-item" to="/intégrer">
			Intégrer le module
		</Link>
		<Link className="menu-item" to="/règles">
			Nos règles
		</Link>
		<Link className="menu-item" to="/à-propos">
			À propos
		</Link>
	</div>
)
