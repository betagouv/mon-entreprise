/* @flow */

import { T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Footer from '../../layout/Footer/Footer'
import logoSvg from './../../images/logo.svg'
import illustrationSvg from './illustration.svg'
import './Landing.css'
import type { SitePaths } from 'Components/utils/withSitePaths'

type Props = {
	sitePaths: SitePaths
}
export default compose(
	withSitePaths,
	withTranslation()
)(({ sitePaths }: Props) => (
	<div className="app-content">
		<div className="ui__ container landing-header">
			<Link className="landing-header__brand-logo" to={sitePaths.index}>
				<img alt="logo mon-entreprise.fr" src={logoSvg} />
			</Link>
			<div style={{ flex: 1 }} />
			<a
				href="https://beta.gouv.fr"
				target="_blank"
				className="landing-header__institutional-logo">
				<img alt="logo marianne" src={marianneSvg} />
			</a>
			<a
				href="https://www.urssaf.fr"
				target="_blank"
				className="landing-header__institutional-logo">
				<img alt="logo urssaf" src={urssafSvg} />
			</a>
		</div>
		<section className="ui__ container landing-title">
			<img
				alt="logo mon-entreprise.fr"
				className="landing-title__logo"
				src={logoSvg}
			/>
			<header>
				<h1>
					<T k="landing.title">L'assistant officiel du créateur d'entreprise</T>
				</h1>
				<p className="ui__ lead">
					<T k="landing.subtitle">
						Les ressources nécessaires pour développer votre activité, du statut
						juridique à l'embauche.
					</T>
				</p>
			</header>
			<img src={illustrationSvg} className="landing-title__img" />
		</section>
		<section className="ui__ choice-group" style={{ flexGrow: 1 }}>
			<div className="ui__ container ">
				<h2>
					<T>Que désirez-vous faire ?</T>
				</h2>
				<Link className="ui__ button-choice " to={sitePaths.entreprise.index}>
					{emoji('💡')} <T k="landing.choix1">Créer mon entreprise</T>
				</Link>
				<Link
					className="ui__ button-choice "
					to={sitePaths.sécuritéSociale.index}>
					{emoji('💶')}{' '}
					<T k="landing.choix2">
						Simuler les cotisations et les taxes
						<small>(dirigeant et salarié)</small>
					</T>
				</Link>
				<Link
					className="ui__ button-choice"
					to={sitePaths.démarcheEmbauche.index}>
					{emoji('🤝')}{' '}
					<T k="landing.choix3">Connaître les démarches d'embauche</T>
				</Link>
				<Link className="ui__ button-choice ui__ button-choice--soon" to={'/'}>
					{emoji('🏡')} <T>Déclarer mon activité d'économie collaborative</T>
					<div style={{ flex: 1 }} />
					<span className="ui__ button-choice-label">
						<T>Prochainement</T>
					</span>
				</Link>
				{/*
				<Link className="ui__ button-choice ui__ button-choice--soon" to={'/'}>
					{emoji('🌍')} Démarrer une activité en France en tant qu'entrepreneur
					étranger
				</Link> */}
			</div>
		</section>
		<Footer />
	</div>
))
