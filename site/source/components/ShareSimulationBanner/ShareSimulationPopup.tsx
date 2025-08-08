import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	Body,
	Button,
	Grid,
	H3,
	Intro,
	SmallBody,
	Strong,
	TextField,
} from '@/design-system'

import { useTracking } from '../ATInternetTracking'

export function ShareSimulationPopup({ url }: { url: string }) {
	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()
	const [linkCopied, setLinkCopied] = useState(false)
	const tracker = useTracking()

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
			<Intro>
				<Trans key="shareSimulation.modal.notice">
					Ce lien peut être utilisé pour accéder à votre simulation
				</Trans>
			</Intro>

			<UrlLabel as="label" htmlFor="simulation-share-url">
				{t('URL de votre simulation')}
			</UrlLabel>

			<Grid container spacing={3}>
				<Grid item xs={12} sm>
					<TextField
						id="simulation-share-url"
						inputRef={inputRef}
						onFocus={selectInput}
						value={url}
					/>
				</Grid>

				{navigator.clipboard ? (
					<Grid item xs={12} sm="auto">
						<Button
							size="XS"
							onPress={() => {
								tracker?.sendEvent('click.action', {
									click_chapter1: 'feature:partage',
									click: 'lien copié',
								})
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

			<Trans i18nKey="shareSimulation.description">
				<H3>À quoi sert le lien de partage&nbsp;?</H3>
				<Body>
					Les simulateurs et assistants de mon-entreprise.urssaf.fr sont{' '}
					<Strong>100 % confidentiels</Strong> : les informations que vous
					renseignez ne quittent jamais votre navigateur.
				</Body>
				<Body>
					Pour <Strong>envoyer une simulation</Strong> à une autre personne, ou{' '}
					<Strong>retrouver votre simulation sur un autre appareil</Strong> que
					celui-ci, vous pouvez utiliser un lien de partage.
				</Body>
				<Body>
					Celui ci contient votre situation directement sous forme de texte.
					Comme ça, pas besoin de passer par un fichier ou par une sauvegarde
					sur un serveur externe&nbsp;!
				</Body>
			</Trans>
		</>
	)
}

const UrlLabel = styled(SmallBody)`
	position: relative;
	top: -${({ theme }) => theme.spacings.xs};
`
