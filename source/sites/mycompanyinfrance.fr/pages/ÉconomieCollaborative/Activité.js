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
		<section
			css={`
				blockquote {
					border-left: 10px solid var(--lighterColour);
					padding: 0 1em;
					margin-left: 0em;
					color: #333;
				}
			`}>
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
				<Exonérations
					{...{ exonérations: data.exonérations, dispatch, title }}
				/>
				{answers.exonerations &&
				all(item => item === true, answers.exonerations) ? (
					<p>
						{emoji('😌 ')}
						En ce qui concerne les revenus de cette activité, vous n'avez pas
						besoin de les déclarer aux impôts, ni d'en faire une activité
						professionnelle.
					</p>
				) : data['seuil pro'] === 0 ? (
					<>
						<p>
							Les revenus de cette activité sont considérés comme des revenus
							profesionnels, et ce dès le 1er euro gagné.{' '}
						</p>
						<p>Vous devez dans tous les cas créer une entreprise.</p>
					</>
				) : (
					<>
						<h2>Vos revenus annuels provenant de cette activité sont :</h2>
						<form>
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
								/>
								Inférieurs à {data['seuil pro']} €
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
								/>
								Supérieurs à {data['seuil pro']} €
							</label>
						</form>
					</>
				)}
				<NextButton
					{...{
						activityAnswers,
						selectedActivities,
						disabled: false
						/* Bien spécifier les cas d'activation du bouton
							answers.pro == undefined &&
							!answers.exoneration &&
							!data['seuil pro'] === 0
							*/
					}}
				/>
			</Animate.fromBottom>
		</section>
	)
})
