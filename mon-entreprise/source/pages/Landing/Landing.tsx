import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
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

				<section className="ui__ light-bg full-width">
					<div
						className="ui__ container"
						css={`
							/* max-width: 1000px !important; */
							display: flex;
							flex-wrap: wrap;
							align-items: end;
							padding-bottom: 1rem;
							justify-content: start;
						`}
					>
						<div
							css={`
								flex: 1.2;
							`}
						>
							<h2 className="ui__ h h4">Rechercher une entreprise</h2>
							<div>
								<input
									className="ui__ cta"
									css={`
										margin-top: 0 !important;
										width: 100% !important;
										min-width: 20rem;
									`}
									placeholder="Nom, SIREN ou SIRET"
								/>
							</div>
						</div>
						<div
							className="ui__ h h4 notice cta"
							css={`
								margin: 1rem -1rem !important;
								flex: 0.15;
								text-align: center;
								align-self: end !important;
							`}
						>
							ou
						</div>
						<h2>
							<Link
								className="ui__ button cta h h4"
								css={`
									white-space: nowrap;
									text-transform: none !important;
									margin: 0 !important;
								`}
								to={
									statutChoisi
										? sitePaths.créer[statutChoisi]
										: sitePaths.créer.index
								}
							>
								<span>
									<Trans i18nKey="landing.choice.create">
										Créer une entreprise
									</Trans>
								</span>{' '}
								{emoji('💡')}
							</Link>
						</h2>
					</div>
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
