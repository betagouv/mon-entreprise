import classnames from 'classnames'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { without } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import Checkbox from 'Ui/Checkbox'
import InfoBulle from 'Ui/InfoBulle'
import activités from './activités.yaml'
import { StoreContext } from './StoreContext'

export default (function ActivitésSelection() {
	let {
		state: { selectedActivities, activityAnswers },
		dispatch
	} = useContext(StoreContext)

	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>Comment déclarer mes revenus des plateformes en ligne ?</h1>
			<section css="margin-bottom: 2rem">
				<p>
					Vous avez des revenus issus des <strong>plateformes en ligne</strong>{' '}
					(Airbnb, Abritel, Drivy, Blablacar, Leboncoin, etc.) ? Vous devez les
					déclarer dans la plupart des cas. Cependant, il peut être difficile de
					s'y retrouver {emoji('🤔')}
				</p>
				<p>
					Suivez ce guide pour savoir en quelques clics comment être en règle.
				</p>
			</section>

			<section className="ui__ full-width choice-group">
				<h2 className="ui__ container">
					Quels types d'activités avez-vous exercé ?
				</h2>

				<MultiItemSelection
					{...{
						items: activités,
						selectedActivities,
						activityAnswers,
						dispatch
					}}
				/>
				<p className="ui__ container notice" css="text-align: center">
					PS : cet outil est là uniquement pour vous informer, aucune donnée ne
					sera transmise aux administrations {emoji('😌')}
				</p>
			</section>
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
			<div css="display: flex; flex-wrap: wrap; justify-content: center">
				{items.map(({ titre, plateformes, icônes, explication }) => {
					let selected = selectedActivities.includes(titre)
					const toggleActivity = () =>
						dispatch({ type: 'SELECT_ACTIVITY', titre })
					return (
						<>
							<button
								className={classnames('ui__ button-choice block', { selected })}
								key={titre}
								tabIndex={-1}
								css="width: 17rem; justify-content: center; margin: 1rem !important"
								onClick={toggleActivity}>
								<div css="display: flex; flex-direction: column; height: 100%; ">
									<div css="transform: scale(1.5) translateY(5px)">
										<Checkbox
											name={titre}
											id={titre}
											checked={selected}
											onChange={toggleActivity}
										/>
									</div>
									<h3 className="title">
										{titre}{' '}
										<InfoBulle>
											<div css="line-height: initial">{explication}</div>
										</InfoBulle>
									</h3>

									<p css="flex: 1" className="ui__ notice">
										{plateformes.join(', ')}
									</p>
									<div>{emoji(icônes)}</div>
								</div>
							</button>
							{activityAnswers[titre]?.completed && (
								<Link to={sitePaths.économieCollaborative.index + '/' + titre}>
									modifier mes réponses
								</Link>
							)}
						</>
					)
				})}
			</div>
			<p css="text-align: center">
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
				? sitePaths.économieCollaborative.index + '/' + nextActivity
				: sitePaths.économieCollaborative.votreSituation

		return (
			<Link
				to={to}
				onClick={action}
				className={classnames('ui__ plain cta button', {
					disabled
				})}>
				Continuer
			</Link>
		)
	}
)
