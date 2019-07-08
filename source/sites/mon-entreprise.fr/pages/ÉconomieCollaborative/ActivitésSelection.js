import classnames from 'classnames'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { intersection } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import Checkbox from 'Ui/Checkbox'
import InfoBulle from 'Ui/InfoBulle'
import { toggleActivité } from './actions'
import { activités, getActivité } from './activitésData'
import { activitésEffectuéesSelector, nextActivitéSelector } from './selectors'
import { StoreContext } from './StoreContext'

export default (function ActivitésSelection() {
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
				<ActivitéSelection activités={activités.map(({ titre }) => titre)} />
				<p className="ui__ container notice" css="text-align: center">
					PS : cet outil est là uniquement pour vous informer, aucune donnée ne
					sera transmise aux administrations {emoji('😌')}
				</p>
			</section>
		</Animate.fromBottom>
	)
})

export const ActivitéSelection = withSitePaths(
	({ activités, currentActivité }) => {
		const { state, dispatch } = useContext(StoreContext)
		const onActivitéToggle = activité =>
			dispatch(toggleActivité(activité, currentActivité))
		const nextButtonDisabled = !intersection(
			activitésEffectuéesSelector(state),
			activités
		).length

		return (
			<>
				<div css="display: flex; flex-wrap: wrap; justify-content: center">
					{activités.map(title => {
						const selected = state[title].effectuée
						const answered = state[title].répondue
						return (
							<ActivitéCard
								key={title}
								title={title}
								selected={selected}
								answered={answered}
								onClick={onActivitéToggle}
							/>
						)
					})}
				</div>
				<NextButton disabled={nextButtonDisabled} />
			</>
		)
	}
)

export const ActivitéCard = withSitePaths(
	({ title, onClick = () => {}, selected, answered, sitePaths }) => (
		<button
			className={classnames('ui__ button-choice block', { selected })}
			key={title}
			tabIndex={-1}
			css="width: 16rem; justify-content: center; margin: 1rem !important"
			onClick={() => onClick(title)}>
			<div css="display: flex; flex-direction: column; height: 100%; ">
				{selected !== undefined && (
					<div css="transform: scale(1.5) translateY(5px)">
						<Checkbox
							name={title}
							id={title}
							checked={selected}
							onChange={() => onClick(title)}
						/>
					</div>
				)}
				<ActivitéContent {...getActivité(title)} />
				{answered && (
					<Link
						onClick={e => e.stopPropagation()}
						className="ui__ small simple button"
						to={sitePaths.économieCollaborative.index + '/' + title}>
						Modifier
					</Link>
				)}
			</div>
		</button>
	)
)

const ActivitéContent = ({ titre, explication, plateformes, icônes }) => (
	<>
		<h3 className="title">
			{titre}{' '}
			<InfoBulle>
				<div css="line-height: initial">{explication}</div>
			</InfoBulle>
		</h3>
		<p css="flex: 1" className="ui__ notice">
			{plateformes.join(', ')}
		</p>
		<div
			css="img {
	margin: 1rem !important;
	transform: scale(1.5) translateY(0.1em);
}">
			{emoji(icônes)}
		</div>
	</>
)

export const NextButton = withSitePaths(({ disabled, sitePaths }) => {
	const { state } = useContext(StoreContext)
	const nextActivité = nextActivitéSelector(state)
	return (
		<p css="text-align: center">
			<Link
				className={classnames('ui__ cta plain button', {
					disabled
				})}
				onClick={e => {
					if (disabled) {
						e.preventDefault()
					}
				}}
				to={
					nextActivité
						? sitePaths.économieCollaborative.index + '/' + nextActivité
						: sitePaths.économieCollaborative.votreSituation
				}>
				Continuer
			</Link>
		</p>
	)
})
