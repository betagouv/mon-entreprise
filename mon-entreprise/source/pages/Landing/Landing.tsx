import CompanyDetails from 'Components/CompanyDetails'
import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import { Appear } from 'Components/ui/animate'
import CardSelection from 'Components/ui/CardSelection'
import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { TrackPage } from '../../ATInternetTracking'
import { SimulateurCard } from '../Simulateurs/Home'
import useSimulatorsData from '../Simulateurs/metadata'
import BrexitPDF from './Brexit_guide.pdf'
import illustrationSvg from './illustration.svg'
import './Landing.css'
import SearchOrCreate from './SearchOrCreate'

export default function Landing() {
	const language = useTranslation().i18n.language
	const simulators = useSimulatorsData()
	const sitePaths = useContext(SitePathsContext)
	const company = useSelector(
		(state: RootState) => state.inFranceApp.existingCompany
	)
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
								L'assistant officiel des entrepreneurs
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

				<section
					className="ui__ light-bg full-width"
					css={`
						padding-bottom: 1rem;
					`}
				>
					<div className="ui__ container">
						{company && (
							<Appear>
								<h2 className="ui__ h h4">Continuer avec l'entreprise</h2>
								<CardSelection to={sitePaths.gérer.index}>
									<CompanyDetails {...company} />
								</CardSelection>
								<br />
							</Appear>
						)}
						<SearchOrCreate />
					</div>
				</section>
				<section>
					<Trans i18nKey="landing.outils">
						<h2>Les outils à votre disposition</h2>
						<p>
							Nous mettons à votre disposition des assistants et simulateurs
							pour vous aider à la gestion de votre entreprise, anticiper les
							prélèvements et planifier votre trésorerie en conséquence.
						</p>
					</Trans>
					<div className="ui__ box-container">
						<SimulateurCard {...simulators.salarié} />
						<SimulateurCard {...simulators['auto-entrepreneur']} />
						<SimulateurCard {...simulators['profession-libérale']} />
					</div>
					<div
						css={`
							text-align: center;
							margin-top: 1rem;
						`}
					>
						<Link
							to={sitePaths.simulateurs.index}
							className="ui__  simple small button"
						>
							<Trans i18nKey="landing.outils_cta">
								<Emoji emoji={'🧮'} /> Découvrir tous les simulateurs et
								assistants
							</Trans>
						</Link>
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
