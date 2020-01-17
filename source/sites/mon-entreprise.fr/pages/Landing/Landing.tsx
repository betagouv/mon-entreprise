import { T } from 'Components'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import logoSvg from 'Images/logo.svg'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
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
						<T k="landing.title">
							L'assistant officiel du créateur d'entreprise
						</T>
					</h1>
					<p className="ui__ lead">
						<T k="landing.subtitle">
							Les ressources nécessaires pour développer votre activité, du
							statut juridique à l'embauche.
						</T>
					</p>
				</header>
				<img src={illustrationSvg} className="landing-title__img" />
			</section>
			<section className="ui__ full-width light-bg center-flex">
				<Link
					className="ui__ interactive card box"
					to={
						statutChoisi ? sitePaths.créer[statutChoisi] : sitePaths.créer.index
					}
				>
					<div className="ui__ big box-icon">{emoji('💡')}</div>
					<T k="landing.choice.create">
						<h3>Créer une entreprise</h3>
						<p className="ui__ notice" css="flex: 1">
							Un accompagnement au choix du statut juridique et la liste
							complète des démarches de création
						</p>
					</T>
					<div className="ui__ small simple button">
						{statutChoisi ? <T>Continuer</T> : <T>Commencer</T>}
					</div>
				</Link>
				<Link className="ui__ interactive card box " to={sitePaths.gérer.index}>
					<div className="ui__ big box-icon">{emoji('💶')}</div>
					<T k="landing.choice.manage">
						<h3>Gérer mon activité</h3>
						<p className="ui__ notice" css="flex: 1">
							Des simulateurs pour anticiper le montant des cotisations sociales
							à payer et mieux gérer votre trésorerie
						</p>
					</T>
					<div className="ui__ small simple button">
						<T>Commencer</T>
					</div>
				</Link>
				<Link
					className="ui__ interactive card box"
					to={sitePaths.économieCollaborative.index}
				>
					<div className="ui__ big box-icon">{emoji('🙋')}</div>
					<T k="landing.choice.declare">
						<h3>Que dois-je déclarer ?</h3>
						<p className="ui__ notice" css="flex: 1">
							Un guide pour savoir comment déclarer vos revenus issus de
							plateformes en ligne (AirBnb, leboncoin, blablacar, etc.)
						</p>
					</T>
					<div className="ui__ small simple button">
						<T>Commencer</T>
					</div>
				</Link>
				<div style={{ width: '100%', textAlign: 'center' }}>
					<Link
						to={sitePaths.simulateurs.index}
						className="ui__  small button "
					>
						{emoji('🧮')}{' '}
						<T k="landing.seeSimulators">Voir la liste des simulateurs</T>
					</Link>
				</div>
			</section>
			<section className="ui__ container">
				<T k="landing.aboutUs">
					<h2>Qui sommes-nous ?</h2>
					<p>
						Nous avons développé ce site pour{' '}
						<strong>accompagner les créateurs d’entreprise</strong> dans le
						développement de leur activité, en leur fournissant des informations
						claires, à jour et pertinente.
					</p>

					<p>
						Notre objectif est de{' '}
						<strong>
							lever toutes les incertitudes vis à vis de l’administration
						</strong>{' '}
						afin que vous puissiez vous concentrer sur ce qui compte : votre
						activité.
					</p>
					<p>
						Nous sommes une petite{' '}
						<strong>équipe autonome et pluridisciplinaire</strong> au sein de l’
						<a href="https://www.urssaf.fr">Urssaf</a>, nous avons à coeur
						d’être au plus proche de nos usagers afin d’améliorer en permanence
						ce site conformément à la méthode des{' '}
						<a href="https://beta.gouv.fr">Startup d’État</a>.
					</p>
					<p>
						N’hésitez pas à nous remonter vos remarques et suggestions à{' '}
						<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
							contact@mon-entreprise.beta.gouv.fr
						</a>
						.
					</p>
				</T>
			</section>

			<Footer />
		</div>
	)
}
