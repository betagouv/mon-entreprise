import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import checklistSvg from './images/checklist.svg'
import { StoreContext } from './StoreContext'
import { allTrue } from './Activité'
import { getActivité } from './reducers'

let nothingToDo = activityAnswers => a => {
	let answers = activityAnswers[a]

	return (
		answers.déclaration === false ||
		(answers.exonérations && allTrue(answers.exonérations))
	)
}
let declarationNeeded = activityAnswers => a => {
	return (
		!nothingToDo(activityAnswers)(a) && !entrepriseNeeded(activityAnswers)(a)
	)
}

let entrepriseNeeded = activityAnswers => a => {
	let answers = activityAnswers[a],
		data = getActivité(a)

	return (
		!nothingToDo(activityAnswers)(a) && (data['seuil pro'] === 0 || answers.pro)
	)
}

let régimeGénéralDisponible = activityAnswers => a => {
	let answers = activityAnswers[a],
		data = getActivité(a)

	return (
		data['seuil régime général'] &&
		entrepriseNeeded(activityAnswers)(a) &&
		!answers.régimeGénéralDépassé
	)
}

let makeListItem = a => {
	let { titre } = getActivité(a)
	return <li key={titre}>{titre}</li>
}

export default withSitePaths(function CoConsommation({ sitePaths }) {
	let {
			state: { selectedActivities, activityAnswers },
			dispatch
		} = useContext(StoreContext),
		selected = selectedActivities.filter(a => !getActivité(a).activités)

	let A = selected.filter(nothingToDo(activityAnswers)).map(makeListItem),
		B = selected.filter(declarationNeeded(activityAnswers)).map(makeListItem),
		C = selected.filter(entrepriseNeeded(activityAnswers)).map(makeListItem),
		D = selected
			.filter(régimeGénéralDisponible(activityAnswers))
			.map(makeListItem)

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
			<section css="ul {margin-left: 2em}">
				{selectedActivities.length === 0 && (
					<Link to={sitePaths.économieCollaborative.activités.index}>
						Renseigner ma situation
					</Link>
				)}
				{A.length > 0 && (
					<>
						<h2>{emoji('🌞 ')} Rien à déclarer !</h2>
						<p>Pour ces activités, vous n'avez rien à faire :</p>
						<ul>{A}</ul>
					</>
				)}
				{B.length > 0 && (
					<>
						<h2>{emoji('📝')} Déclarer simplement aux impôts</h2>
						<p>
							Pour ces activités, vous devez simplement déclarer vos revenus sur
							votre feuille d'imposition :
						</p>
						<ul>{B}</ul>
					</>
				)}

				{C.length > 0 && (
					<>
						<h2>{emoji('💼')} Créer une activité professionnelle</h2>
						<p>Pour ces activités, vous devez créer une entreprise :</p>
						<ul>{C}</ul>
						<div className="ui__ answer-group">
							<Link
								to={sitePaths.entreprise.trouver}
								className="ui__ simple button">
								J'ai déjà une entreprise
							</Link>
							<Link
								to={sitePaths.entreprise.index}
								className="ui__ plain button">
								Créer une entreprise
							</Link>
						</div>
					</>
				)}
				{D.length > 0 && (
					<>
						<h2>{emoji('👋')} Régime général disponible</h2>
						<p>
							Pour ces activités, pour{' '}
							<strong>éviter de créer une entreprise</strong>, vous pouvez
							simplement déclarer l'activité au régime général :
						</p>
						<ul>{D}</ul>
					</>
				)}
			</section>
		</Animate.fromBottom>
	)
})
