import { all } from 'ramda'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React, { useState, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import activités from './activités.yaml'
import { createMarkdownDiv } from 'Engine/marked'
import { StoreContext } from './StoreContext'
import { NextButton } from './ActivitésSelection'
import Exonérations from './Exonérations'

let allTrue = list => list && all(item => item === true)(list)

export default withSitePaths(function LocationMeublée({
	sitePaths,
	match: {
		params: { title }
	}
}) {
	let {
			state: { selectedActivities, activityAnswers },
			dispatch
		} = useContext(StoreContext),
		data = activités.find(({ titre }) => titre === title),
		answers = activityAnswers[title] || {}

	return (
		<section>
			<Animate.fromBottom>
				<ScrollToTop />
				<h1>
					{emoji(data.icônes)} {data.titre}
				</h1>
				{createMarkdownDiv(data.explication)}
				{data.plateformes && (
					<p>
						{emoji('📱 ')}
						Exemples de plateformes : {data.plateformes.join(', ')}
					</p>
				)}
				<h2>Votre situation</h2>
				<Exonérations
					{...{ exonérations: data.exonérations, answers, dispatch, title }}
				/>
				{answers.exonérations && allTrue(answers.exonérations) ? (
					<p>
						{emoji('😌 ')}
						En ce qui concerne les revenus de cette activité, vous n'avez pas
						besoin de les déclarer aux impôts, ni d'en faire une activité
						professionnelle.
					</p>
				) : data['seuil pro'] === 0 ? (
					<p>
						Les revenus de cette activité sont considérés comme des{' '}
						<strong>revenus professionnels dès le 1er euro gagné</strong>.
					</p>
				) : (
					<>
						<p>Vos revenus annuels pour cette activité sont :</p>
						<form
							css={`
								label {
									display: block;
									margin: 0.6rem 0;
								}
							`}>
							<label>
								<input
									type="radio"
									name="seuil-pro"
									value="non-pro"
									checked={answers.pro === false}
									onChange={() =>
										dispatch({
											type: 'UPDATE_ACTIVITY',
											title,
											data: { ...answers, pro: false }
										})
									}
								/>{' '}
								inférieurs à {data['seuil pro']} €
							</label>
							<label>
								<input
									type="radio"
									name="seuil-pro"
									value="pro"
									checked={answers.pro === true}
									onChange={() =>
										dispatch({
											type: 'UPDATE_ACTIVITY',
											title,
											data: { ...answers, pro: true }
										})
									}
								/>{' '}
								supérieurs à {data['seuil pro']} €
							</label>
						</form>
					</>
				)}
				{JSON.stringify(data)}
				{JSON.stringify(answers)}
				<NextButton
					{...{
						activityAnswers,
						selectedActivities,
						disabled: incompleteActivity(data, answers),
							currentActivité: title,
							action :
					()=>
						dispatch({
							type: 'UPDATE_ACTIVITY',
							title,
							data: { ...answers, completed: true }
						})
					
					}}
				/>
			</Animate.fromBottom>
		</section>
	)
})

export let incompleteActivity = (data, answers) =>
	(data['seuil pro'] > 0 &&
		!allTrue(answers.exonérations) &&
		answers.pro == null) ||
	(data['exonérations'] && answers.exonérations == null)
