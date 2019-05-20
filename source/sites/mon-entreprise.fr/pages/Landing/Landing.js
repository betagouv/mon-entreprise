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
import illustrationSvg from './illustration.svg'
import './Landing.css'
import logoSvg from './logo.svg'
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
			<header>
				<h1>
					<T k="subtitle">Le guide officiel du créateur d'entreprise</T>
				</h1>
				<p className="ui__ lead">
					Toutes les ressources nécessaire pour gérer votre activité, du statut
					juridique à l'embauche.
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
					{emoji('💡')} <T>Créer une entreprise</T>
				</Link>
				<Link
					className="ui__ button-choice "
					to={sitePaths.sécuritéSociale.index}>
					{emoji('💶')} <T>Estimer les cotisations et les taxes</T>
				</Link>
				<Link
					className="ui__ button-choice"
					to={sitePaths.démarcheEmbauche.index}>
					{emoji('🤝')} <T>Connaître les démarches d'embauche</T>
				</Link>
				<Link className="ui__ button-choice ui__ button-choice--soon" to={'/'}>
					<span className="ui__ button-choice-label">
						<T>prochainement</T>
					</span>
					{emoji('🏡')} <T>Déclarer mon activité d'économie collaborative</T>
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
