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
		<section className="landing__banner" style={{ backgroundColor: colour }}>
			<header>
				<h1>
					<T k="siteName">Mon-entreprise.fr</T>
				</h1>
				<p className="ui__ lead" style={{ maxWidth: '35rem' }}>
					<T k="subtitle">Le guide officiel du créateur d'entreprise</T>
				</p>

				<svg
					className="landing__banner__svg white"
					preserveAspectRatio="none"
					viewBox="5 0 495 150">
					<path fill="white" d="M 0 150 Q 150 0 500 0 L 500 150 Z" />
				</svg>
			</header>
		</section>
		<section className="ui__ container" style={{ flexGrow: 1 }}>
			<div className="landing__header">
				<img alt="logo marianne" src={marianneSvg} />
				<img alt="logo urssaf" src={urssafSvg} />
			</div>
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
			<Link
				className="ui__ button-choice ui__ button-choice--soon"
				to={sitePaths.économieCollaborative.index}>
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
