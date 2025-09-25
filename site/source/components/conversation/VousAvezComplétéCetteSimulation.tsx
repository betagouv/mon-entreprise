import React, { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import { JeDonneMonAvis } from '@/components/JeDonneMonAvis'
import Notifications from '@/components/Notifications'
import { Body, Button, Emoji, Grid, H3, Spacing } from '@/design-system'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'

interface Props {
	customEndMessages?: React.ReactNode
	onPrevious?: () => void
}

export function VousAvezComplétéCetteSimulation({
	customEndMessages,
	onPrevious,
}: Props) {
	const { currentSimulatorData } = useCurrentSimulatorData()

	const [firstRenderDone, setFirstRenderDone] = useState(false)
	useEffect(() => setFirstRenderDone(true), [])

	return (
		<>
			<div style={{ textAlign: 'center' }}>
				{firstRenderDone && <TrackPage name="simulation_terminee" />}
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
					<Grid item xs={6} sm="auto">
						<Button light onPress={onPrevious} size="XS">
							<span aria-hidden>←</span> <Trans>Précédent</Trans>
						</Button>
					</Grid>
					<Grid
						item
						xs={6}
						sm
						style={{
							justifyContent: 'flex-end',
							display: 'flex',
						}}
					></Grid>
				</Grid>
			</div>
			<Notifications />
		</>
	)
}
