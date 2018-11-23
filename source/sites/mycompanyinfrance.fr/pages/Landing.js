/* @flow */

import withColours from 'Components/utils/withColours'
import marianneSvg from 'Images/marianne.svg'
import urssafSvg from 'Images/urssaf.svg'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Trans, withNamespaces } from 'react-i18next'
import { Link } from 'react-router-dom'
import companySvg from '../images/company.svg'
import estimateSvg from '../images/estimate.svg'
import hiringSvg from '../images/hiring.svg'
import Footer from '../layout/Footer/Footer'
import sitePaths from '../sitePaths'
import './Landing.css'

export default withNamespaces()(
	withColours(({ colours: { colour } }) => (
		<>
			<header className="landing__header">
				<img alt="logo marianne" src={marianneSvg} />
				<img alt="logo urssaf" src={urssafSvg} />
			</header>
			<section className="landing__banner" style={{ backgroundColor: colour }}>
				<header>
					<h1>
						<Trans>Créez votre entreprise</Trans>
						<br />
						{emoji('🇫🇷')}
					</h1>
					<p className="ui__ lead" style={{ maxWidth: '30rem' }}>
						<Trans i18nKey="subtitle">
							Le guide ultime, de la forme juridique à l'embauche.
						</Trans>
					</p>
					<Link
						className="ui__ inverted-button"
						to={sitePaths().entreprise.index}
						alt="the first step to create a company">
						<Trans>Commencer</Trans>
					</Link>
					<svg
						className="landing__banner__svg white"
						preserveAspectRatio="none"
						viewBox="5 0 495 150">
						<path fill="white" d="M 0 150 Q 150 0 500 0 L 500 150 Z" />
					</svg>
				</header>
			</section>
			<section className="landing-explanation">
				<div>
					<h2>
						<Trans i18nKey="accueil.entreprise.titre">
							Votre projet d'entreprise
						</Trans>
					</h2>
					<div className="landing-explanation-content">
						<img alt="Your new company" src={companySvg} />
						<ul>
							<li>
								<Trans i18nKey="accueil.entreprise.1">
									Trouver la forme juridique adaptée
								</Trans>
							</li>
							<li>
								<Trans i18nKey="accueil.entreprise.2">
									Suivre les étapes pour créer l'entreprise
								</Trans>
							</li>
						</ul>
					</div>
					<p>
						<Link
							className="ui__ skip-button"
							to={sitePaths().entreprise.index}>
							<Trans i18nKey="accueil.entreprise.action">
								Créez votre entreprise ›
							</Trans>
						</Link>
					</p>
				</div>
				<div>
					<h2>
						<Trans i18nKey="accueil.sécu.titre">La sécurité sociale</Trans>
					</h2>
					<div className="landing-explanation-content">
						<img alt="Social security" src={estimateSvg} />
						<ul>
							<li>
								<Trans i18nKey="accueil.sécu.1">
									Découvrez le système de sécurité sociale
								</Trans>
							</li>
							<li>
								<Trans i18nKey="accueil.sécu.2">
									Simulez le coût d'embauche
								</Trans>
							</li>
						</ul>
					</div>
					<p>
						<Link
							className="ui__ skip-button"
							to={sitePaths().sécuritéSociale.index}>
							<Trans i18nKey="accueil.sécu.action">
								Découvrez le coût et les avantages ›
							</Trans>
						</Link>
					</p>
				</div>
				<div>
					<h2>
						<Trans i18nKey="accueil.embauche.titre">
							Votre premier employé
						</Trans>
					</h2>
					<div className="landing-explanation-content">
						<img alt="Social security" src={hiringSvg} />
						<ul>
							<li>
								<Trans i18nKey="accueil.embauche.1">
									Découvrez les démarches pour embaucher
								</Trans>
							</li>
							<li>
								<Trans i18nKey="accueil.embauche.2">
									Découvrez les bases du droit du travail
								</Trans>
							</li>
						</ul>
					</div>
					<p>
						<Link
							className="ui__ skip-button"
							to={sitePaths().démarcheEmbauche.index}>
							<Trans i18nKey="accueil.embauche.action">
								Découvrez le proccessus d'embauche
							</Trans>
						</Link>
					</p>
				</div>
			</section>
			<Footer />
		</>
	))
)
