import { Button } from 'DesignSystem/buttons'
import { TextField } from 'DesignSystem/field'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import { useContext, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'

const LinkAndButton = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 1rem;

	& > :first-child {
		flex-grow: 1;
	}
`

export function ShareSimulationPopup({ url }: { url: string }) {
	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()
	const [linkCopied, setLinkCopied] = useState(false)
	const tracker = useContext(TrackingContext)

	const selectInput = () => inputRef.current?.select()
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

			<LinkAndButton>
				<TextField
					inputRef={inputRef}
					onFocus={selectInput}
					value={url}
					aria-label="URL de votre simulation"
				/>
				{navigator.clipboard ? (
					<Button
						size="XS"
						onPress={() => {
							tracker.click.set({
								chapter1: 'feature:partage',
								type: 'action',
								name: 'lien copié',
							})
							tracker.dispatch()
							navigator.clipboard.writeText(url)
							setLinkCopied(true)
						}}
					>
						{linkCopied ? (
							<>✅ {t('shareSimulation.button.copied', 'Copié')}</>
						) : (
							<>📋 {t('shareSimulation.button.copy', 'Copier le lien')}</>
						)}
					</Button>
				) : (
					<SmallBody>
						{t(
							'shareSimulation.modal.helpText',
							'Le lien est sélectionné, vous pouvez le copier/coller'
						)}
					</SmallBody>
				)}
			</LinkAndButton>
		</>
	)
}
