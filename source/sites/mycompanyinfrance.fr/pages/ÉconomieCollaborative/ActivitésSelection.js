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
	let { state, dispatch } = useContext(StoreContext)
	let { selectedActivities } = state

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Quels sont vos revenus ?</h1>
			<p>
				Les seuils de déclaration ne sont pas les mêmes en fonction du type
				d'activité que vous exercez. Sélectionnez toutes les plateformes depuis
				lesquelles vous avez reçu de l'argent durant l'année.
			</p>
			<ul
				css={`
					display: flex;
					justify-content: space-evenly;
					flex-wrap: wrap;
					li > * {
						width: 100%;
					}
					li {
						margin: 1rem 0;
						cursor: pointer;
						text-align: center
						width: 12em;
						.title {
							font-weight: 500;
						}
						img {
							width: 2em !important;
							height: 2em !important;
							margin: 0.6em 0 !important;
						}
						p {
							font-size: 95%;
							font-style: italic;
							text-align: center;
							line-height: 1em;
						}
					}
					li:hover, li.selected {background: var(--colour); color: white}
				`}>
				{activités.map(({ titre, plateformes, icônes }) => {
					let selected = selectedActivities.includes(titre)
					return (
						<li
							className={classnames('ui__ card ', { selected })}
							key={titre}
							onClick={() => dispatch({ type: 'SELECT_ACTIVITY', titre })}>
							<div className="title">{titre}</div>
							{emoji(icônes)}
							<p>{plateformes.join(', ')}</p>
						</li>
					)
				})}
			</ul>
			<p css="text-align: right">
				<NextButton
					{...{
						activityAnswers: state.activityAnswers,
						selectedActivities,
						disabled: !selectedActivities.length
					}}
				/>
			</p>
		</Animate.fromBottom>
	)
})

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
