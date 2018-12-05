/* @flow */

import withColours from 'Components/utils/withColours'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import Footer from '../layout/Footer/Footer'
import sitePaths from '../sitePaths'
import './Landing.css'

export default withNamespaces()(
	withColours(({ colours: { colour } }) => (
		<>
			<section className="landing__banner" style={{ backgroundColor: colour }}>
				<header>
					<h1>
						<Trans>Mon entreprise simplifiée</Trans>
					</h1>
					<p className="ui__ lead" style={{ maxWidth: '30rem' }}>
						<Trans i18nKey="subtitle">
							Toutes les ressources pour créer et administrer votre activité.
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
			<section className="ui__ container" style={{ paddingBottom: '2rem' }}>
				<div className="landing__header">
					<img alt="logo marianne" src={marianneSvg} />
					<img alt="logo urssaf" src={urssafSvg} />
				</div>
				<h2 style={{ textAlign: 'center' }}>
					{emoji('🧭')} Que souhaitez vous faire ?
				</h2>
				<Animate.fromBottom>
					<Link className="landing__choice " to={sitePaths().entreprise.index}>
						{emoji('💡')} Créer une nouvelle entreprise
					</Link>
					<Link className="landing__choice " to={'/'}>
						{emoji('🏡')} Déclarer une petite activité rémunératrice (airbnb,
						leboncoin, blablacar...)
					</Link>
					<Link
						className="landing__choice "
						to={sitePaths().sécuritéSociale.index}>
						{emoji('💶')} Estimer les cotisations et la protection sociale
					</Link>

					<Link
						className="landing__choice "
						to={sitePaths().démarcheEmbauche.index}>
						{emoji('🤝')} Connaître les démarches d'embauche
					</Link>

					<Link className="landing__choice " to={'/'}>
						{emoji('🌍')} Démarrer une activité en France en tant
						qu'entrepreneur étranger
					</Link>
				</Animate.fromBottom>
			</section>
			<Footer />
		</>
	))
)
