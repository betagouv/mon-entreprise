import { Grid } from '@mui/material'
import { FromBottom } from 'Components/ui/animate'
import Emoji from 'Components/utils/Emoji'
import { ScrollToTop } from 'Components/utils/Scroll'
import { Spacing } from 'DesignSystem/layout'
import { H1, H2 } from 'DesignSystem/typography/heading'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { intersection } from 'ramda'
import React, { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TrackPage } from '../../../ATInternetTracking'
import { ActiviteCard } from './ActiviteCard'
import { Activity } from './Activité'
import { activités } from './activitésData'
import NextButton from './NextButton'
import {
	activitésEffectuéesSelector,
	activitésRéponduesSelector,
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
			<FromBottom>
				<TrackPage name="accueil" />
				<ScrollToTop />
				<H1>{titre}</H1>
				<section css="margin-bottom: 2rem">
					<Trans i18nKey="économieCollaborative.accueil.contenu">
						<Body>
							Vous avez des revenus issus des{' '}
							<strong>plateformes en ligne</strong> (Airbnb, Abritel, Drivy,
							Blablacar, Leboncoin, etc.) ? Vous devez les déclarer dans la
							plupart des cas. Cependant, il peut être difficile de s'y
							retrouver{' '}
							<span>
								<Emoji emoji="🤔" />
							</span>
							.
						</Body>
						<Body>
							Suivez ce guide pour savoir en quelques clics comment être en
							règle.
						</Body>
						<SmallBody className="ui__ notice">
							Ces revenus sont communiqués automatiquement par les plateformes à
							l’administration fiscale et à l’Urssaf.
						</SmallBody>
					</Trans>
				</section>

				<section className="ui__ full-width light-bg">
					<H2>
						<Trans i18nKey="économieCollaborative.accueil.question">
							Quels types d'activités avez-vous exercé ?
						</Trans>
					</H2>
					<ActivitéSelection
						activités={activités.map(({ titre }: Activity) => titre)}
					/>
					<SmallBody className="notice">
						<Trans i18nKey="économieCollaborative.accueil.réassurance">
							PS : cet outil est là uniquement pour vous informer, aucune donnée
							ne sera transmise aux administrations
						</Trans>{' '}
						<Emoji emoji="😌" />
					</SmallBody>
				</section>
			</FromBottom>
		</>
	)
}

type ActivitéSelectionProps = {
	activités: Array<string>
	currentActivité?: string
}

export const ActivitéSelection = ({
	activités,
	currentActivité,
}: ActivitéSelectionProps) => {
	const { state } = useContext(StoreContext)
	const activitéRépondue = activitésRéponduesSelector(state)
	const nextButtonDisabled = !intersection(
		activitésEffectuéesSelector(state),
		activités
	).length

	return (
		<>
			<Grid container spacing={2}>
				{activités.map((title) => {
					const selected = state[title].effectuée
					const answered = activitéRépondue.includes(title)
					return (
						<Grid key={title} item xs={6} md={4}>
							<ActiviteCard
								title={title}
								interactive
								selected={selected}
								answered={answered}
							/>
						</Grid>
					)
				})}
			</Grid>
			<Spacing md />
			<NextButton
				disabled={nextButtonDisabled}
				activité={currentActivité as any}
			/>
		</>
	)
}
