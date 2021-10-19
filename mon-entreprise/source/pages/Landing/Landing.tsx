import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import Emoji from 'Components/utils/Emoji'
import Meta from 'Components/utils/Meta'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import logoSvg from 'Images/logo.svg'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import BrexitPDF from './Brexit_guide.pdf'
import illustrationSvg from './illustration.svg'
import './Landing.css'

export default function Landing() {
	const sitePaths = useContext(SitePathsContext)
	const statutChoisi = useSelector(
		(state: RootState) => state.inFranceApp.companyStatusChoice
	)
	const language = useTranslation().i18n.language
	return (
		<>
			<TrackPage chapter1="informations" name="accueil" />
			<Meta
				page="landing"
				title="Mon-entreprise"
				description="L'assistant officiel de l'entrepreneur"
				ogImage={logoSvg}
			/>
			<Header />
			<div className="app-content ui__ container">
				{language === 'en' && (
					<div className="ui__ plain card" style={{ textAlign: 'center' }}>
						<Emoji emoji="🇬🇧" /> <strong>Brexit</strong> :{' '}
						<a href={BrexitPDF} target="_blank">
							Discover the impact on your social protection{' '}
						</a>
					</div>
				)}
				<section className="landing-title">
					<img
						alt="logo mon-entreprise.fr"
						className="landing-title__logo"
						src={logoSvg}
					/>
					<header>
						<h1>
							<Trans i18nKey="landing.title">
								L'assistant officiel de l'entrepreneur
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

				<section className="ui__ full-width box-container">
					<Link
						className="ui__ interactive card light-border box"
						to={
							statutChoisi
								? sitePaths.créer[statutChoisi]
								: sitePaths.créer.index
						}
					>
						<div className="ui__ big box-icon">
							<Emoji emoji="💡" />
						</div>
						<Trans i18nKey="landing.choice.create">
							<h3>Créer une entreprise</h3>
							<p className="ui__ notice">
								Un accompagnement au choix du statut juridique et la liste
								complète des démarches de création
							</p>
						</Trans>
						<div className="ui__ small simple button">
							{statutChoisi ? (
								<Trans>Continuer</Trans>
							) : (
								<Trans>Commencer</Trans>
							)}
						</div>
					</Link>
					<Link
						className="ui__ interactive card light-border box "
						to={sitePaths.gérer.index}
					>
						<div className="ui__ big box-icon">
							<Emoji emoji="💶" />
						</div>
						<Trans i18nKey="landing.choice.manage">
							<h3>Gérer mon activité</h3>
							<p className="ui__ notice">
								Des outils personnalisés pour anticiper le montant des
								cotisations sociales à payer et mieux gérer votre trésorerie.
							</p>
						</Trans>
						<div className="ui__ small simple button">
							<Trans>Commencer</Trans>
						</div>
					</Link>
					<Link
						className="ui__ interactive card light-border box"
						to={sitePaths.simulateurs.index}
					>
						<div className="ui__ big box-icon">
							<Emoji emoji="🧮" />
						</div>
						<Trans i18nKey="landing.choice.simulators">
							<h3>Accéder aux simulateurs</h3>
							<p className="ui__ notice">
								La liste exhaustive de tous les simulateurs disponibles sur le
								site.
							</p>
						</Trans>
						<div className="ui__ small simple button">
							<Trans>Découvrir</Trans>
						</div>
					</Link>
				</section>
				<section>
					<Trans i18nKey="landing.aboutUs">
						<h2>Qui sommes-nous ?</h2>
						<p>
							Nous sommes une petite{' '}
							<a href="https://beta.gouv.fr/startups/mon-entreprise.html#equipe">
								équipe
							</a>{' '}
							autonome et pluridisciplinaire au sein de l’
							<a href="https://www.urssaf.fr">Urssaf</a>. Nous avons à cœur
							d’être au près de vos besoins afin d’améliorer en permanence ce
							site conformément à l'approche{' '}
							<a href="https://beta.gouv.fr/approche/manifeste">beta.gouv.fr</a>
							.
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
			</div>
			<Footer />
		</>
	)
}
