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
		return (
			<div id="header">
				{!this.props.iframe && (
					<Link id="brand" to="/">
						<img
							id="logo"
							src={require('Images/logo/logo-simulateur.svg')}
							alt="Un service de l'État français"
						/>
						<h1>Simulateur d'embauche</h1>
					</Link>
				)}
				{this.props.iframe &&
					screenfull.enabled && (
						<div id="iframeFullscreen" onClick={() => screenfull.toggle()}>
							<span>
								<Trans>Plein écran</Trans>
							</span>
							<i
								className="fa fa-arrows-alt"
								aria-hidden="true"
								style={{ color: this.props.textColourOnWhite }}
							/>
						</div>
					)}
				<div id="headerRight">
					<nav className={this.state.mobileNavVisible ? 'visible' : ''}>
						<Links toggle={this.togglemobileNavVisible} />
					</nav>
					<LangSwitcher />
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
@connect(null, dispatch => ({
	changeLanguage: lang => dispatch({ type: CHANGE_LANG, lang })
}))
export class LangSwitcher extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	getUnusedLanguageCode = () => {
		let languageCode = this.context.i18n.language
		return !languageCode || languageCode === 'fr' ? 'en' : 'fr'
	}

	changeLanguage = () => {
		let nextLanguage = this.getUnusedLanguageCode()
		this.props.changeLanguage(nextLanguage)
		this.context.i18n.changeLanguage(nextLanguage)
	}
	render() {
		return (
			<span id="langSwitcher">
				<button onClick={this.changeLanguage}>
					{do {
						let languageCode = this.getUnusedLanguageCode()
						;<span>
							<img src={require(`Images/${languageCode}.png`)} />
							{languageCode.toUpperCase()}
						</span>
					}}
				</button>
			</span>
		)
	}
}
