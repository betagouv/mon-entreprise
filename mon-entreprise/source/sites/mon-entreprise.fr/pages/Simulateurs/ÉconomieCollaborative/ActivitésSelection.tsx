import classnames from 'classnames'
import Animate from 'Components/ui/animate'
import Checkbox from 'Components/ui/Checkbox'
import InfoBulle from 'Components/ui/InfoBulle'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { intersection } from 'ramda'
import React, { useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { debounce } from '../../../../../utils'
import { toggleActivité } from './actions'
import { Activity } from './Activité'
import { activités, getTranslatedActivité } from './activitésData'
import NextButton from './NextButton'
import {
	activitésEffectuéesSelector,
	activitésRéponduesSelector
} from './selectors'
import { StoreContext } from './StoreContext'

export default function ActivitésSelection() {
	const { t } = useTranslation()
	const titre = t(
		'économieCollaborative.accueil.titre',
		'Comment déclarer mes revenus des plateformes en ligne ?'
	)
	return (
		<>
			<Animate.fromBottom>
				<ScrollToTop />
				<h1>{titre}</h1>
				<section css="margin-bottom: 2rem">
					<Trans i18nKey="économieCollaborative.accueil.contenu">
						<p>
							Vous avez des revenus issus des{' '}
							<strong>plateformes en ligne</strong> (Airbnb, Abritel, Drivy,
							Blablacar, Leboncoin, etc.) ? Vous devez les déclarer dans la
							plupart des cas. Cependant, il peut être difficile de s'y
							retrouver <span>{emoji('🤔')}</span>.
						</p>
						<p>
							Suivez ce guide pour savoir en quelques clics comment être en
							règle.
						</p>
						<p className="ui__ notice">
							À partir de 2020, ces revenus seront communiqués automatiquement
							par les plateformes à l’administration fiscale et à l’Urssaf.
						</p>
					</Trans>
				</section>

				<section className="ui__ full-width light-bg">
					<h2 className="ui__ container" css="text-align: center">
						<Trans i18nKey="économieCollaborative.accueil.question">
							Quels types d'activités avez-vous exercé ?
						</Trans>
					</h2>
					<ActivitéSelection
						activités={activités.map(({ titre }: Activity) => titre)}
					/>
					<p className="ui__ container notice" css="text-align: center">
						<Trans i18nKey="économieCollaborative.accueil.réassurance">
							PS : cet outil est là uniquement pour vous informer, aucune donnée
							ne sera transmise aux administrations
						</Trans>{' '}
						{emoji('😌')}
					</p>
				</section>
			</Animate.fromBottom>
		</>
	)
}

type ActivitéSelectionProps = {
	activités: Array<string>
	currentActivité?: string
}

export const ActivitéSelection = ({
	activités,
	currentActivité
}: ActivitéSelectionProps) => {
	const { state } = useContext(StoreContext)
	const activitéRépondue = activitésRéponduesSelector(state)
	const nextButtonDisabled = !intersection(
		activitésEffectuéesSelector(state),
		activités
	).length

	return (
		<>
			<div css="display: flex; flex-wrap: wrap; justify-content: center">
				{activités.map(title => {
					const selected = state[title].effectuée
					const answered = activitéRépondue.includes(title)
					return (
						<ActivitéCard
							key={title}
							title={title}
							interactive
							selected={selected}
							answered={answered}
						/>
					)
				})}
			</div>
			<NextButton
				disabled={nextButtonDisabled}
				activité={currentActivité as any}
			/>
		</>
	)
}

type ActivitéCardProps = {
	title: string
	selected?: boolean
	interactive?: boolean
	answered: boolean
	label?: React.ReactNode
	className?: string
}

export const ActivitéCard = ({
	title,
	selected,
	interactive,
	answered,
	label,
	className
}: ActivitéCardProps) => {
	const sitePaths = useContext(SitePathsContext)
	const { dispatch } = useContext(StoreContext)
	const { language } = useTranslation().i18n
	const toggle = useCallback(
		selected !== undefined
			? // debounce to avoid double onClick call when clicking on checkbox
			  debounce(1, () => dispatch(toggleActivité(title)))
			: () => {},
		[dispatch, selected]
	)

	return React.createElement(
		interactive ? 'button' : 'div',
		{
			className: classnames('ui__ card box', className, {
				selected,
				interactive
			}),
			style: {
				flex: 1,
				minWidth: '15rem'
			},
			key: title,
			...(interactive && { tabIndex: -1 }),
			onMouseDown: toggle
		},
		<div css="display: flex; flex-direction: column; height: 100%; width: 100%; align-items: center">
			{selected !== undefined && (
				<div css="font-size: 1.5rem;">
					<Checkbox name={title} id={title} checked={selected} readOnly />
				</div>
			)}
			<ActivitéContent
				{...getTranslatedActivité(title, language)}
				label={label}
			/>
			{answered && (
				<Link
					onClick={e => e.stopPropagation()}
					className="ui__ small simple button"
					to={sitePaths.simulateurs.économieCollaborative.index + '/' + title}
				>
					<Trans>Modifier</Trans>
				</Link>
			)}
		</div>
	)
}

const ActivitéContent = ({
	titre,
	explication,
	plateformes,
	icônes,
	label
}: any) => (
	<>
		<h4 className="title">
			{titre}{' '}
			<InfoBulle>
				<div css="line-height: initial">{explication}</div>
			</InfoBulle>
		</h4>

		<p className="ui__ notice">{plateformes.join(', ')}</p>
		{label && <div className="ui__ label"> {label}</div>}
		<div className="ui__ box-icon">{emoji(icônes)}</div>
	</>
)
