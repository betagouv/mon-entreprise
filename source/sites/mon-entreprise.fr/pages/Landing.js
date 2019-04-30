/* @flow */

import { T } from 'Components'
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Footer from '../layout/Footer/Footer'
import './Landing.css'
import type { ThemeColours } from 'Components/utils/withColours'
import type { SitePaths } from 'Components/utils/withSitePaths'
import logo from '../images/logo mon-entreprise.png'

type Props = {
	colours: ThemeColours,
	sitePaths: SitePaths
}
export default compose(
	withSitePaths,
	withColours,
	withTranslation()
)(({ colours: { colour }, sitePaths }: Props) => (
	<div className="app-content">
		<section className="landing__banner">
			<header>
				<img src={logo} style={{ width: '20em' }} />
				<p className="ui__ lead" style={{ maxWidth: '35rem' }}>
					<T k="subtitle">Le guide officiel du créateur d'entreprise</T>
				</p>
			</header>
		</section>
		<section className="ui__ container" style={{ flexGrow: 1 }}>
			<div className="landing__header" />
			<h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<T>Que souhaitez-vous faire ?</T>
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
		</section>
		<Footer />
	</div>
))
