import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import checklistSvg from './images/checklist.svg'

export default withSitePaths(function CoConsommation({ sitePaths }) {
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
			<h2>Co-consommation</h2>
			<ul>
				<li>Vous n'avez rien à déclarer {emoji('🌞')}</li>
			</ul>
			<h2>Location meublée</h2>
			{window.location.search.includes('middle') ? (
				<>
					<ul>
						<li>
							Vos recettes annuelles sont supérieure à 23 000€, les revenus de
							cette activité présentent un caractère professionnel, vous devez
							donc payer des cotisations sociales.
						</li>
					</ul>
					<h1>???</h1>
					<p>
						Entreprise existante ? Travailleur non salarié ? Micro-entreprise ?
						Déclaration au régime général ? Multi-activité ?{' '}
					</p>
				</>
			) : (
				<>
					<ul>
						<li>
							Vos recettes annuelles sont supérieure à 23 000€, les revenus de
							cette activité présentent un caractère professionnel, vous devez
							donc payer des cotisations sociales.
						</li>
						<li>
							Vos recettes annuelles sont supérieure à 82 000€, vous devez créer
							une entreprise pour pouvoir les déclarer à l'administration.
						</li>
					</ul>
					<div className="ui__ answer-group">
						<Link
							to={sitePaths.entreprise.trouver}
							className="ui__ simple button">
							J'ai déjà une entreprise
						</Link>
						<Link to={sitePaths.entreprise.index} className="ui__ plain button">
							Créer une entreprise
						</Link>
					</div>
				</>
			)}
		</Animate.fromBottom>
	)
})
