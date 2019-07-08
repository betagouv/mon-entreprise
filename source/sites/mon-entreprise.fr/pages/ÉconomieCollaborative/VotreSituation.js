import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link, Redirect } from 'react-router-dom'
import Animate from 'Ui/animate'
import { ActivitéCard } from './ActivitésSelection'
import {
	activitésEffectuéesSelector,
	déclarationsSelector,
	nextActivitéSelector,
	régimeGénéralNonDisponibleSelector
} from './selectors'
import { StoreContext } from './StoreContext'

export default withSitePaths(function VotreSituation({ sitePaths }) {
	const { state } = useContext(StoreContext)

	if (!activitésEffectuéesSelector(state).length) {
		return <Redirect to={sitePaths.économieCollaborative.index} />
	}

	const nextActivité = nextActivitéSelector(state)
	if (nextActivité) {
		return (
			<Redirect
				to={sitePaths.économieCollaborative.index + '/' + nextActivité}
			/>
		)
	}

	const déclarations = déclarationsSelector(state)
	const régimeGénéralNonDisponible = régimeGénéralNonDisponibleSelector(state)

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>
				Que dois-je faire pour être en règle ? <br />
			</h1>
			<section>
				{déclarations.IMPOSITION.length > 0 && (
					<>
						<h2>{emoji('📝')} Déclarer aux impôts</h2>
						<ActivitéList activités={déclarations.IMPOSITION} />
						<p>
							Vous avez seulement besoin de déclarer vos revenus sur votre
							feuille d'imposition. Pour savoir plus, rendez-vous sur le site
							impots.gouv.fr
						</p>
					</>
				)}

				{déclarations.PRO.length > 0 && (
					<>
						<h2>{emoji('💼')} Créer une activité professionnelle</h2>
						<ActivitéList activités={déclarations.PRO} />

						<p>
							Vos revenus sont considérées comme revenus professionnels, ils
							sont soumis aux cotisations sociale. En contrepartie, ils donnent
							droits à des prestations sociales (retraite, assurance maladie,
							indemnités, etc.).
						</p>
						{!régimeGénéralNonDisponible && (
							<>
								<h3>Régime général disponible</h3>
								<p>
									Si vous n'avez pas d'entreprise et ne souhaitez pas en créer
									une, vous pouvez simplement déclarer vos revenus sur le site
									de l'Urssaf.
								</p>
							</>
						)}

						<div className="ui__ choice-group full-width">
							<div className="ui__ container">
								<h3>Déclarer mes revenus</h3>
								{!régimeGénéralNonDisponible && (
									<a
										href="https://www.urssaf.fr/portail/home/espaces-dedies/activites-relevant-de-leconomie/vous-optez-pour-le-regime-genera.html"
										className="ui__  button-choice">
										Déclarer au régime général
									</a>
								)}
								<Link
									to={sitePaths.entreprise.trouver}
									className="ui__  button-choice">
									Déclarer avec une entreprise existante
								</Link>
								<Link
									to={sitePaths.entreprise.index}
									className="ui__ button-choice">
									Déclarer avec une nouvelle entreprise
								</Link>
							</div>
						</div>
					</>
				)}
				{déclarations.AUCUN.length > 0 && (
					<>
						<h2>{emoji('🌞 ')} Rien à déclarer !</h2>
						<ActivitéList activités={déclarations.AUCUN} />
					</>
				)}
			</section>
		</Animate.fromBottom>
	)
})

const ActivitéList = ({ activités }) => (
	<div
		className="ui__"
		css="display: flex; flex-wrap: wrap; margin: -1rem -1rem 0rem">
		{activités.map(title => (
			<ActivitéCard key={title} title={title} answered />
		))}
	</div>
)
