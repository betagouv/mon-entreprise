import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import checklistSvg from './images/checklist.svg'
import { StoreContext } from './StoreContext'

export default withSitePaths(function CoConsommation({ sitePaths }) {
	let {
		state: { selectedActivities, activityAnswers },
		dispatch
	} = useContext(StoreContext)
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>
				Que dois-je déclarer ? <br />
				<small css="font-size: 70% !important" className="ui__ notice">
					Le point sur votre situation
				</small>
			</h1>
			<img
				css="max-width: 100%; height: 200px; margin: 2rem auto;display:block;"
				src={checklistSvg}
			/>
			<h2>Tout est bon ! </h2>
			<p>Vous n'avez rien à déclarer {emoji('🌞')}</p>
			<h2>Déclarer simplement aux impôts</h2>
			<ul>
				<li>
					{' '}
					<strong>Location meublée</strong>: Vos revenus annuels sont inférieurs
					à 23 000€, il vous suffit donc de le déclarer sur votre feuille
					d'impôts.
				</li>
			</ul>
			<h2>Créer une activité professionnelle</h2>
			<ul>
				<li>
					<strong>Vente de services</strong> : Dès le 1er euro, vous devez faire
					de cette source de revenus une activité professionnelle. Vous devez
					donc payer des cotisations sociales, et vous donnera droit à une
					protection sociale.
				</li>
			</ul>
			<div className="ui__ answer-group">
				<Link to={sitePaths.entreprise.trouver} className="ui__ simple button">
					J'ai déjà une entreprise
				</Link>
				<Link to={sitePaths.entreprise.index} className="ui__ plain button">
					Créer une entreprise
				</Link>
			</div>
		</Animate.fromBottom>
	)
})
