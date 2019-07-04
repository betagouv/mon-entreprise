import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { createMarkdownDiv } from 'Engine/marked'
import { all } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import { MultiItemSelection, NextButton } from './ActivitésSelection'
import Exonérations from './Exonérations'
import { flatActivités } from './reducers'
import { StoreContext } from './StoreContext'

export let allTrue = list => list && all(item => item === true)(list)

export let BackToSelection = withSitePaths(({ sitePaths }) => (
	<Link to={sitePaths.économieCollaborative.index}>
		Revenir à la sélection des activités
	</Link>
))
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
		data = flatActivités.find(({ titre }) => titre === title)

	if (data.activités) {
		return (
			<Animate.fromBottom>
				<h1>{data.titre}</h1>
				<p>{data.explication}</p>
				<p>Quels sont plus précisément les types d'activités exercées ? </p>
				<section className="ui__ full-width choice-group">
					<MultiItemSelection
						{...{
							items: data.activités,
							selectedActivities,
							activityAnswers,
							dispatch,
							buttonAttributes: {
								currentActivité: title,
								action: () =>
									dispatch({
										type: 'UPDATE_ACTIVITY',
										title,
										data: { completed: true }
									})
							}
						}}
					/>
				</section>
			</Animate.fromBottom>
		)
	}

	let answers = activityAnswers[title] || {}

	return (
		<section>
			<BackToSelection />
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
							{data['seuil déclaration'] && (
								<label>
									<input
										type="radio"
										name="seuil-déclaration"
										value="déclaration"
										checked={answers.déclaration === false}
										onChange={() =>
											dispatch({
												type: 'UPDATE_ACTIVITY',
												title,
												data: { ...answers, pro: false, déclaration: false }
											})
										}
									/>{' '}
									inférieurs à {data['seuil déclaration']} €
								</label>
							)}
							<label>
								<input
									type="radio"
									name="seuil-pro"
									value="non-pro"
									checked={
										answers.pro === false && answers.déclaration !== false
									}
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
									checked={
										answers.pro === true && !answers.régimeGénéralDépassé
									}
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
							{data['seuil régime général'] && (
								<label>
									<input
										type="radio"
										name="seuil-régime-général"
										value="régime-général"
										checked={answers.régimeGénéralDépassé === true}
										onChange={() =>
											dispatch({
												type: 'UPDATE_ACTIVITY',
												title,
												data: {
													...answers,
													pro: true,
													régimeGénéralDépassé: true
												}
											})
										}
									/>{' '}
									supérieurs à {data['seuil régime général']} €
								</label>
							)}
						</form>
					</>
				)}
				<NextButton
					{...{
						activityAnswers,
						selectedActivities,
						disabled: incompleteActivity(data, answers),
						currentActivité: title,
						action: () =>
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
