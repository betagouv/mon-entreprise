import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Animate from 'Ui/animate'
import { ActivitéCard } from './ActivitésSelection'
import illustration from './images/multitasking.svg'
import {
	activitésEffectuéesSelector,
	déclarationsSelector,
	nextActivitéSelector,
	régimeGénéralDisponibleSelector
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
	const régimeGénéralDisponible = activitésEffectuéesSelector(state).some(
		activité => régimeGénéralDisponibleSelector(state, activité)
	)

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>
				Que dois-je faire pour être en règle ? <br />
			</h1>
			<div css="text-align: center">
				<img css="height: 200px" src={illustration} />
			</div>
			<section>
				{déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE.length > 0 && (
					<>
						<h2>Créer une activité professionnelle</h2>
						<p>
							Vos revenus sont considérés comme revenus professionnels, ils sont
							soumis aux cotisations sociales. En contrepartie, ils ouvrent vos
							droit à des prestations sociales (retraite, assurance maladie,
							maternité, etc.).
						</p>
						{régimeGénéralDisponible && (
							<>
								<h3>Régime général disponible</h3>
								<p>
									Vous pouvez déclarer les revenus issus de ces activités
									directement sur le site de l'Urssaf.C'est une option
									intéressante si vous ne souhaitez pas créer d'entreprise ou
									modifier une entreprise existante. Vous devrez dans tous les
									cas déclarer ces revenus aux impôts.
								</p>
							</>
						)}
						<h3>Mes options</h3>
						<p
							className="ui__ answer-group"
							css="justify-content: start !important; flex-wrap: wrap;">
							{régimeGénéralDisponible && (
								<a
									href="https://www.urssaf.fr/portail/home/espaces-dedies/activites-relevant-de-leconomie/vous-optez-pour-le-regime-genera/comment-simmatriculer.html"
									css="flex: 1"
									className="ui__ small   button">
									Déclarer au régime général
								</a>
							)}
							<Link
								to={sitePaths.entreprise.index}
								css="flex: 1"
								className="ui__  small button">
								Déclarer avec une nouvelle entreprise
							</Link>
							<Link
								to={sitePaths.entreprise.trouver}
								css="flex: 1"
								className="ui__   small button">
								Déclarer avec une entreprise existante
							</Link>
						</p>

						<h3>Quelles activités sont concernées ?</h3>
						<ActivitéList activités={déclarations.RÉGIME_GÉNÉRAL_DISPONIBLE} />
					</>
				)}
				{déclarations.IMPOSITION.length > 0 && (
					<>
						<h2>Déclarer vos revenus aux impôts</h2>
						<p>
							Pour ces activités, vous avez uniquement besoin de déclarer vos
							revenus sur votre feuille d'imposition. Pour en savoir plus, vous
							pouvez consulter la{' '}
							<a href="https://www.impots.gouv.fr/portail/particulier/questions/comment-declarer-mes-revenus-dactivites-annexes-telles-que-le-co-voiturage-la">
								page dédiée sur impots.gouv.fr
							</a>
							.
						</p>
						<h3>Quelles activités sont concernées ?</h3>
						<ActivitéList activités={déclarations.IMPOSITION} />
					</>
				)}

				{déclarations.AUCUN.length > 0 && (
					<>
						<h2>Rien à faire</h2>
						<p>
							Vous n'avez pas besoin de déclarer vos revenus pour ces activités.
						</p>

						<ActivitéList activités={déclarations.AUCUN} />
					</>
				)}
			</section>
		</Animate.fromBottom>
	)
})

const ActivitéList = ({ activités }) => {
	const { state } = useContext(StoreContext)
	return (
		<div css="display: flex; flex-wrap: wrap; margin: 0 -1rem;">
			{activités.map(title => (
				<ActivitéCard
					key={title}
					title={title}
					className="light-bg"
					answered
					label={
						régimeGénéralDisponibleSelector(state, title)
							? 'Régime général disponible'
							: null
					}
				/>
			))}
		</div>
	)
}
