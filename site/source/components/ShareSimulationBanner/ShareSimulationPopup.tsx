import { Grid } from '@mui/material'
import { Button } from '@/design-system/buttons'
import { TextField } from '@/design-system/field'
import { Spacing } from '@/design-system/layout'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useContext, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TrackingContext } from '../../ATInternetTracking'

export function ShareSimulationPopup({ url }: { url: string }) {
	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()
	const [linkCopied, setLinkCopied] = useState(false)
	const tracker = useContext(TrackingContext)

	const selectInput = () => {
		inputRef.current?.select()
	}
	useEffect(selectInput, [])

	useEffect(() => {
		const handler = setTimeout(() => setLinkCopied(false), 5000)

		return () => {
			clearTimeout(handler)
		}
	}, [linkCopied])

	return (
		<>
			<Body>
				<Trans key="shareSimulation.modal.notice">
					Voici le lien que vous pouvez envoyer pour accéder à votre simulation.
				</Trans>
			</Body>

			<Grid container spacing={2}>
				<Grid item xs={12} sm>
					<TextField
						inputRef={inputRef}
						onFocus={selectInput}
						value={url}
						autoFocus
						aria-label="URL de votre simulation"
					/>
				</Grid>

				{navigator.clipboard ? (
					<Grid item xs={12} sm="auto">
						<Button
							size="XS"
							onPress={() => {
								tracker.click.set({
									chapter1: 'feature:partage',
									type: 'action',
									name: 'lien copié',
								})
								tracker.dispatch()
								navigator.clipboard.writeText(url).catch((err) =>
									// eslint-disable-next-line no-console
									console.error(err)
								)
								setLinkCopied(true)
							}}
						>
							{linkCopied ? (
								<>✅ {t('shareSimulation.button.copied', 'Copié')}</>
							) : (
								<>📋 {t('shareSimulation.button.copy', 'Copier le lien')}</>
							)}
						</Button>
					</Grid>
				) : (
					<Grid item lg={12}>
						<SmallBody>
							{t(
								'shareSimulation.modal.helpText',
								'Le lien est sélectionné, vous pouvez le copier/coller'
							)}
						</SmallBody>
					</Grid>
				)}
			</Grid>
			<Spacing xl />
		</>
	)
}
