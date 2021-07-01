import Animate from 'Components/ui/animate'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { TrackPage } from '../../../ATInternetTracking'
import { ActivitéCard } from './ActivitésSelection'
import illustration from './images/multitasking.svg'
import {
	activitésEffectuéesSelector,
	déclarationsSelector,
	nextActivitéSelector,
	régimeGénéralDisponibleSelector,
} from './selectors'
import { StoreContext } from './StoreContext'

export default function VotreSituation() {
	const sitePaths = useContext(SitePathsContext)
	const { state } = useContext(StoreContext)
	const { t } = useTranslation()
	if (!activitésEffectuéesSelector(state).length) {
		return <Redirect to={sitePaths.simulateurs.économieCollaborative.index} />
	}
	const titre = t(
		'économieCollaborative.obligations.titre',
		'Que dois-je faire pour être en règle ?'
	)

	const nextActivité = nextActivitéSelector(state)
	if (nextActivité) {
		return (
			<Redirect
				to={
					sitePaths.simulateurs.économieCollaborative.index + '/' + nextActivité
				}
			/>
		)
	}

	const déclarations = déclarationsSelector(state)
	const régimeGénéralDisponible = activitésEffectuéesSelector(state).some(
		(activité) => régimeGénéralDisponibleSelector(state, activité)
	)

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<TrackPage name="simulation terminée" />
			<Helmet>
				<title>{titre}</title>
			</Helmet>
			<h1>{titre}</h1>
			<div css="text-align: center">
				<img css="height: 200px" src={illustration} />
			</div>
			<section>
				{déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.pro">
							<h2>Déclarer en tant qu'activité professionnelle</h2>
							<p>
								Vos revenus sont considérés comme revenus professionnels, ils
								sont soumis aux cotisations sociales. En contrepartie, ils
								ouvrent vos droit à des prestations sociales (retraite,
								assurance maladie, maternité, etc.).
							</p>
						</Trans>
						<ActivitéList activités={déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE} />
						<Trans i18nKey="économieCollaborative.obligations.entreprise">
							<h3>Avec une entreprise</h3>
							<p>
								Si vous possédez déjà une activité déclarée, vous pouvez ajouter
								ces revenus à ceux de l'entreprise. Il vous faudra seulement
								vérifier que son objet social est compatible avec les activités
								concernées (et le changer si besoin). Sinon, vous aurez à créer
								une nouvelle entreprise.
							</p>
							<Link
								to={sitePaths.créer.index}
								css="flex: 1"
								className="ui__   simple small button"
							>
								Créer une entreprise
							</Link>
						</Trans>

						{régimeGénéralDisponible && (
							<Trans i18nKey="économieCollaborative.obligations.régimeGénéral">
								<h3>Avec l'option régime général</h3>
								<p>
									Pour certaines activités, vous pouvez déclarer vos revenus
									directement sur le site de l'Urssaf. C'est une option
									intéressante si vous ne souhaitez pas créer d'entreprise ou
									modifier une entreprise existante. Vous devrez dans tous les
									cas déclarer ces revenus aux impôts.
								</p>
								<a
									href="https://www.urssaf.fr/portail/home/espaces-dedies/activites-relevant-de-leconomie/vous-optez-pour-le-regime-genera/comment-simmatriculer.html"
									css="flex: 1"
									className="ui__ small simple button"
								>
									Déclarer au régime général
								</a>
							</Trans>
						)}
					</>
				)}
				{déclarations.IMPOSITION.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.impôts">
							<h2>Déclarer vos revenus aux impôts</h2>
							<p>
								Pour ces activités, vous avez uniquement besoin de déclarer vos
								revenus sur votre feuille d'imposition. Pour en savoir plus,
								vous pouvez consulter la{' '}
								<a href="https://www.impots.gouv.fr/portail/particulier/questions/comment-declarer-mes-revenus-dactivites-annexes-telles-que-le-co-voiturage-la">
									page dédiée sur impots.gouv.fr
								</a>
								.
							</p>
						</Trans>
						<ActivitéList activités={déclarations.IMPOSITION} />
					</>
				)}

				{déclarations.AUCUN.length > 0 && (
					<>
						<Trans i18nKey="économieCollaborative.obligations.aucune">
							<h2>Rien à faire</h2>
							<p>
								Vous n'avez pas besoin de déclarer vos revenus pour ces
								activités.
							</p>
						</Trans>
						<ActivitéList activités={déclarations.AUCUN} />
					</>
				)}
			</section>
			<section>
				<h2>
					{emoji('🧰')} <Trans>Ressources utiles</Trans>
				</h2>
				<div css="display: flex; flex-wrap: wrap; margin: 0 -1rem;">
					<a
						target="_blank"
						className="ui__ interactive card small box lighter-bg"
						href="https://www.urssaf.fr/portail/files/live/sites/urssaf/files/documents/5877Plaquetteecoeollaborative.pdf"
					>
						<Trans i18nKey="économieCollaborative.obligations.guide">
							<p>Consulter le guide Urssaf</p>
							<p className="ui__ notice">
								Découvrez les modalités des statuts sociaux pour chaque type de
								locations (bien, meublé, courte durée, classé, etc.).
							</p>
							<span className="ui__ small label">PDF</span>
						</Trans>
					</a>
				</div>
			</section>
		</Animate.fromBottom>
	)
}

const ActivitéList = ({ activités }: { activités: string[] }) => {
	const { state } = useContext(StoreContext)
	return (
		<div css="display: flex; flex-wrap: wrap; margin: 0 -1rem;">
			{activités.map((title) => (
				<ActivitéCard
					key={title}
					title={title}
					className="lighter-bg"
					answered
					label={
						régimeGénéralDisponibleSelector(state, title) ? (
							<Trans i18nKey="économieCollaborative.obligations.régimeGénéralDisponible">
								Régime général disponible
							</Trans>
						) : null
					}
				/>
			))}
		</div>
	)
}
