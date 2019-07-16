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
				{déclarations.PRO.length > 0 && (
					<>
						<h2>Créer une activité professionnelle</h2>
						<p>
							Vos revenus sont considérés comme revenus professionnels, ils sont
							soumis aux cotisations sociales. En contrepartie, ils donnent
							droit à des prestations sociales (retraite, assurance maladie,
							etc.).
						</p>
						{régimeGénéralDisponible && (
							<>
								<h3>Régime général disponible</h3>
								<p>
									Pour certaines activités, si vous n'avez pas d'entreprise et
									ne souhaitez pas en créer une, vous pouvez simplement déclarer
									vos revenus sur le site de l'Urssaf. Vous devrez dans tous les
									cas les déclarer aussi aux impôts.
								</p>
							</>
						)}
						<h3>Mes options</h3>
						<p
							className="ui__ answer-group"
							css="justify-content: start !important; flex-wrap: wrap;">
							{régimeGénéralDisponible && (
								<a
									href="https://ats.declaration.urssaf.fr/Application-ECOLAB-Inscription/"
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
						<ActivitéList activités={déclarations.PRO} />
					</>
				)}
				{déclarations.IMPOSITION.length > 0 && (
					<>
						<h2>Déclarer vos revenus aux impôts</h2>
						<p>
							Pour ces activités, vous avez uniquement besoin de déclarer vos
							revenus sur votre feuille d'imposition. Pour en savoir plus,
							rendez-vous sur le site impots.gouv.fr.
						</p>
						<h3>Quelles activités sont concernées ?</h3>
						<ActivitéList activités={déclarations.IMPOSITION} />
					</>
				)}

				{déclarations.AUCUN.length > 0 && (
					<>
						<h2>Rien à faire</h2>
						<p>
							Vous n'avez pas besoin de déclarer vos revenu à l'administration
							pour ces activités.
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
		<div css="display: flex; flex-wrap: wrap;">
			{activités.map(title => (
				<ActivitéCard
					key={title}
					title={title}
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
