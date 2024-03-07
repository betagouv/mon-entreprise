import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import React from 'react'
import { Trans } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import SeeAnswersButton from '@/components/conversation/SeeAnswersButton'
import { useNavigateQuestions } from '@/components/conversation/useNavigateQuestions'
import { JeDonneMonAvis } from '@/components/JeDonneMonAvis'
import Notifications from '@/components/Notifications'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

interface Props {
	firstRenderDone: boolean
	customEndMessages?: React.ReactNode
	previousAnswers: DottedName[]
	customSituationVisualisation?: React.ReactNode
}

export function VousAvezComplétéCetteSimulation({
	firstRenderDone,
	customEndMessages,
	previousAnswers,
	customSituationVisualisation,
}: Props) {
	const { currentSimulatorData } = useCurrentSimulatorData()

	const { goToPrevious } = useNavigateQuestions()

	return (
		<>
			<div style={{ textAlign: 'center' }}>
				{firstRenderDone && <TrackPage name="simulation terminée" />}
				<H3 as="h2">
					<Emoji emoji="🌟" />{' '}
					<Trans i18nKey="simulation-end.title">
						Vous avez complété cette simulation
					</Trans>
				</H3>
				<Body>
					{customEndMessages || (
						<Trans i18nKey="simulation-end.text">
							Vous avez maintenant accès à l'estimation la plus précise
							possible.
						</Trans>
					)}
				</Body>
				{currentSimulatorData?.pathId === 'simulateurs.salarié' && (
					<>
						<JeDonneMonAvis />
						<Spacing md />
					</>
				)}
				<Grid container spacing={2}>
					{previousAnswers.length > 0 && (
						<Grid item xs={6} sm="auto">
							<Button light onPress={goToPrevious} size="XS">
								<span aria-hidden>←</span> <Trans>Précédent</Trans>
							</Button>
						</Grid>
					)}
					<Grid
						item
						xs={6}
						sm
						style={{
							justifyContent: 'flex-end',
							display: 'flex',
						}}
					>
						<SeeAnswersButton>{customSituationVisualisation}</SeeAnswersButton>
					</Grid>
				</Grid>
			</div>
			<Notifications />
		</>
	)
}
