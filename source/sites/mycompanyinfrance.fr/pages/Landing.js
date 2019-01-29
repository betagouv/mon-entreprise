/* @flow */

import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import { compose } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import Footer from '../layout/Footer/Footer'
import './Landing.css'

export default compose(
	withNamespaces(),
	withColours,
	withSitePaths
)(({ colours: { colour }, sitePaths }) => (
	<>
		<section className="landing__banner" style={{ backgroundColor: colour }}>
			<header>
				<h1>
					<Trans>Mon-entreprise.fr</Trans>
				</h1>
				<p className="ui__ lead" style={{ maxWidth: '35rem' }}>
					<Trans i18nKey="subtitle">
						Les ressources pour créer et administrer votre activité en toute
						simplicité.
					</Trans>
				</p>

				<svg
					className="landing__banner__svg white"
					preserveAspectRatio="none"
					viewBox="5 0 495 150">
					<path fill="white" d="M 0 150 Q 150 0 500 0 L 500 150 Z" />
				</svg>
			</header>
		</section>
		<section className="ui__ container">
			<div className="landing__header">
				<img alt="logo marianne" src={marianneSvg} />
				<img alt="logo urssaf" src={urssafSvg} />
			</div>
			<h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
				{emoji('🧭')} Que souhaitez vous faire ?
			</h2>
			<Animate.fromBottom>
				<Link className="landing__choice " to={sitePaths.entreprise.index}>
					{emoji('💡')} Créer une entreprise
				</Link>

				<Link className="landing__choice " to={sitePaths.sécuritéSociale.index}>
					{emoji('💶')} Estimer les cotisations et les taxes
				</Link>

				<Link className="landing__choice" to={sitePaths.démarcheEmbauche.index}>
					{emoji('🤝')} Connaître les démarches d'embauche
				</Link>
				<Link className="landing__choice landing__choice--soon" to={'/'}>
					{emoji('🏡')} Déclarer mon activité d'économie collaborative
				</Link>

				<Link className="landing__choice landing__choice--soon" to={'/'}>
					{emoji('🌍')} Démarrer une activité en France en tant qu'entrepreneur
					étranger
				</Link>
			</Animate.fromBottom>
		</section>
		<Footer />
	</>
))
