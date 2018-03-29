import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import PropTypes from 'prop-types'
import 'Components/pages/Header.css'
import { Link } from 'react-router-dom'
import screenfull from 'screenfull'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { CHANGE_LANG } from '../../actions'

@withRouter
@connect(state => ({
	iframe: state.iframe,
	textColourOnWhite: state.themeColours.textColourOnWhite
}))
@translate()
export class Header extends Component {
	state = {
		mobileNavVisible: false
	}
	togglemobileNavVisible = () =>
		this.setState({ mobileNavVisible: !this.state.mobileNavVisible })

	render() {
		let { location } = this.props
		let appMode = ['/simu', '/règle'].find(t => location.pathname.includes(t))
		if (this.props.iframe)
			return screenfull.enabled ? (
				<div
					id="iframeFullscreen"
					onClick={() => screenfull.toggle()}
					className={appMode ? 'absolute' : ''}
				>
					{!appMode && <span><Trans>Mode plein écran</Trans></span>}
					<i
						className="fa fa-arrows-alt"
						aria-hidden="true"
						style={{ color: this.props.textColourOnWhite }}
					/>
				</div>
			) : null

		let displayHeader = !appMode

		if (!displayHeader) return null

		return (
			<div id="header">
				<Link id="brand" to="/">
					<img
						id="logo"
						src={require('Images/logo/logo-simulateur.svg')}
						alt="Un service de l'État français"
					/>
					<h1>Simulateur d'embauche</h1>
				</Link>
				<div id="headerContent">
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
					<img
						id="marianne"
						src={require('Images/marianne.svg')}
						alt="Un service de l'État français"
					/>
				</div>
			</div>
		)
	}
}

let Links = ({ toggle }) => (
	<div id="links" onClick={toggle}>
		<Link className="menu-item" to="/intégrer">
			Intégrer le module
		</Link>
		<Link className="menu-item" to="/contribuer">
			Contribuer
		</Link>
		<Link className="menu-item" to="/règles">
			Toutes nos règles
		</Link>
		<Link className="menu-item" to="/à-propos">
			À propos
		</Link>
	</div>
)

@withRouter
@translate()
@connect(
	state => ({}),
	dispatch => ({
		changeLanguage: (lang) => dispatch({ type: CHANGE_LANG, lang })
	})
)
export class Footer extends Component {
	static contextTypes = {
      i18n: PropTypes.object.isRequired
    }
	render() {
		let { i18n } = this.context
		let changeLanguage = lng => {
				this.props.changeLanguage(lng)
				i18n.changeLanguage(lng)
			}
		let appMode = ['/simu', '/regle'].find(t =>
			this.props.location.pathname.includes(t)
		)
		return (
			<div id="footer">
				<span onClick={() => changeLanguage('en')}>(en)</span>/<span onClick={() => changeLanguage('fr')}>(fr)</span>&nbsp;
				{appMode &&
				(<Link to="/à-propos">
					<Trans>À propos</Trans> <i className="fa fa-question-circle" aria-hidden="true" />
				</Link>)}
			</div>
		)
	}
}
