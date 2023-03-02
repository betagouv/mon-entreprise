import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import { FromBottom } from '@/components/ui/animate'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { H1, H2 } from '@/design-system/typography/heading'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import { ActiviteCard } from './ActiviteCard'
import { Activity } from './Activité'
import NextButton from './NextButton'
import { StoreContext } from './StoreContext'
import { activités } from './activitésData'
import {
	activitésEffectuéesSelector,
	activitésRéponduesSelector,
} from './selectors'

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
					<Spacing xl />
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
	currentActivité = '',
}: ActivitéSelectionProps) => {
	const { state } = useContext(StoreContext)
	const activitéRépondue = (state && activitésRéponduesSelector(state)) ?? []
	const nextButtonDisabled =
		state !== null &&
		activitésEffectuéesSelector(state).every((a) => !activités.includes(a))

	return (
		<>
			<Grid container spacing={2} role="list">
				{activités.map((title) => {
					const selected = state?.[title].effectuée
					const answered = activitéRépondue.includes(title)

					return (
						<Grid key={title} item xs={6} sm={4} md={3} role="listitem">
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
			<Spacing xl />
			<NextButton disabled={nextButtonDisabled} activité={currentActivité} />
		</>
	)
}
