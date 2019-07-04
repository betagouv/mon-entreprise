import classnames from 'classnames'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { without } from 'ramda'
import React, { useState, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import activités from './activités.yaml'
import { StoreContext } from './StoreContext'
import { incompleteActivity } from './Activité'

export default (function ActivitésSelection() {
	let {
		state: { selectedActivities, activityAnswers },
		dispatch
	} = useContext(StoreContext)

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Vos revenus</h1>
			<p>
				Sélectionnez toutes les plateformes depuis lesquelles vous avez reçu de
				l'argent durant l'année.
			</p>
			<p>
				En fonction du type d'activité et du revenu, vous devrez compléter votre
				déclaration d'impôt ou créer une entreprise.
			</p>
			<MultiItemSelection
				{...{
					items: activités,
					selectedActivities,
					activityAnswers,
					dispatch
				}}
			/>
		</Animate.fromBottom>
	)
})

export let MultiItemSelection = withSitePaths(
	({
		items,
		selectedActivities,
		activityAnswers,
		dispatch,
		buttonAttributes,
		sitePaths
	}) => (
		<>
			<ul css={multiCardSelectionStyle}>
				{items.map(({ titre, plateformes, icônes }) => {
					let selected = selectedActivities.includes(titre)
					return (
						<li>
							<div
								className={classnames('ui__ card ', { selected })}
								key={titre}
								onClick={() => dispatch({ type: 'SELECT_ACTIVITY', titre })}>
								<div className="title">{titre}</div>
								{emoji(icônes)}
								<p>{plateformes.join(', ')}</p>
							</div>
							{activityAnswers[titre]?.completed && (
								<Link
									to={
										sitePaths.économieCollaborative.activités.index +
										'/' +
										titre
									}>
									modifier mes réponses
								</Link>
							)}
						</li>
					)
				})}
			</ul>
			<p css="text-align: right">
				<NextButton
					{...{
						activityAnswers,
						selectedActivities,
						disabled: !selectedActivities.length,
						...buttonAttributes
					}}
				/>
			</p>
		</>
	)
)

export let NextButton = withSitePaths(
	({
		sitePaths,
		activityAnswers,
		selectedActivities,
		disabled,
		currentActivité,
		action
	}) => {
		let nextActivity = without([currentActivité], selectedActivities).find(
				a => !activityAnswers[a].completed
			),
			to = nextActivity
				? sitePaths.économieCollaborative.activités.index + '/' + nextActivity
				: sitePaths.économieCollaborative.votreSituation

		return (
			<Link
				css={`
					margin-top: 1rem;
				`}
				to={to}
				onClick={action}
				className={classnames('ui__ plain button', {
					disabled
				})}>
				Continuer
			</Link>
		)
	}
)

let multiCardSelectionStyle = `
					display: flex;
					justify-content: space-evenly;
					flex-wrap: wrap;
					li > * {
						width: 100%;
					}
					li {
					list-style-type: none;
						margin: 1rem 0;
						cursor: pointer;
						text-align: center
						width: 12em;
						.title {
							font-weight: 500;
						}
						img {
						font-size: 150%;
							margin: 0.6em 0 !important;
						}
						p {
							font-size: 95%;
							font-style: italic;
							text-align: center;
							line-height: 1em;
						}
					}
						@media (hover) {
						
							li:hover > div {background: var(--colour); color: white}
						}
					 li > div.selected {background: var(--colour); color: white}

					@media  (max-width: 800px){
					li {
					width: 95%;
					margin: .6rem 0;

					}
					}
				`
