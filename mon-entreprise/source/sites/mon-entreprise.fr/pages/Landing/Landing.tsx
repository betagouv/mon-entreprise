import { SitePathsContext } from 'Components/utils/SitePathsContext'
import logoSvg from 'Images/logo.svg'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import Footer from '../../layout/Footer/Footer'
import illustrationSvg from './illustration.svg'
import './Landing.css'

export default function Landing() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	return (
		<div className="app-content">
			<section className="ui__ container landing-title">
				<img
					alt="logo mon-entreprise.fr"
					className="landing-title__logo"
					src={logoSvg}
				/>
				<header>
					<h1>
						<Trans i18nKey="landing.title">
							L'assistant officiel du créateur d'entreprise
						</Trans>
					</h1>
					<p className="ui__ lead">
						<Trans i18nKey="landing.subtitle">
							Les ressources nécessaires pour développer votre activité, du
							statut juridique à l'embauche.
						</Trans>
					</p>
				</header>
				<img src={illustrationSvg} className="landing-title__img" />
			</section>

			<section className="ui__ full-width light-bg center-flex">
				<div style={{ textAlign: 'center', width: '100%' }}>
					<Link to={sitePaths.coronavirus} className="ui__ plain small button">
						{emoji('😷')}{' '}
						<Trans>
							Covid-19 : Découvrir les mesures de soutien aux entreprises
						</Trans>
					</Link>
				</div>
				<Link
					className="ui__ interactive card box"
					to={
						statutChoisi ? sitePaths.créer[statutChoisi] : sitePaths.créer.index
					}
				>
					<div className="ui__ big box-icon">{emoji('💡')}</div>
					<Trans i18nKey="landing.choice.create">
						<h3>Créer une entreprise</h3>
						<p className="ui__ notice" css="flex: 1">
							Un accompagnement au choix du statut juridique et la liste
							complète des démarches de création
						</p>
					</Trans>
					<div className="ui__ small simple button">
						{statutChoisi ? <Trans>Continuer</Trans> : <Trans>Commencer</Trans>}
					</div>
				</Link>
				<Link className="ui__ interactive card box " to={sitePaths.gérer.index}>
					<div className="ui__ big box-icon">{emoji('💶')}</div>
					<Trans i18nKey="landing.choice.manage">
						<h3>Gérer mon activité</h3>
						<p className="ui__ notice" css="flex: 1">
							Des simulateurs pour anticiper le montant des cotisations sociales
							à payer et mieux gérer votre trésorerie
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Commencer</Trans>
					</div>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={sitePaths.économieCollaborative.index}
				>
					<div className="ui__ big box-icon">{emoji('🙋')}</div>
					<Trans i18nKey="landing.choice.declare">
						<h3>Que dois-je déclarer ?</h3>
						<p className="ui__ notice" css="flex: 1">
							Un guide pour savoir comment déclarer vos revenus issus de
							plateformes en ligne (AirBnb, leboncoin, blablacar, etc.)
						</p>
					</Trans>
					<div className="ui__ small simple button">
						<Trans>Commencer</Trans>
					</div>
				</Link>
				<div style={{ width: '100%', textAlign: 'center' }}>
					<Link
						to={sitePaths.simulateurs.index}
						className="ui__  small button "
					>
						{emoji('🧮')}{' '}
						<Trans i18nKey="landing.seeSimulators">
							Voir la liste des simulateurs
						</Trans>
					</Link>
				</div>
			</section>
			<section className="ui__ container">
				<Trans i18nKey="landing.aboutUs">
					<h2>Qui sommes-nous ?</h2>
					<p>
						Nous sommes une petite{' '}
						<strong>équipe autonome et pluridisciplinaire</strong> au sein de l’
						<a href="https://www.urssaf.fr">Urssaf</a>. Nous avons à coeur
						d’être au près de vos besoins afin d’améliorer en permanence ce site
						conformément à la méthode des{' '}
						<a href="https://beta.gouv.fr">Startup d’État</a>.
					</p>
					<p>
						Nous avons développé ce site pour{' '}
						<strong>accompagner les créateurs d’entreprise</strong> dans le
						développement de leur activité.
					</p>

					<p>
						Notre objectif est de{' '}
						<strong>
							lever toutes les incertitudes vis à vis de l’administration
						</strong>{' '}
						afin que vous puissiez vous concentrer sur ce qui compte : votre
						activité.
					</p>
				</Trans>
			</section>

			<Footer />
		</div>
	)
}
