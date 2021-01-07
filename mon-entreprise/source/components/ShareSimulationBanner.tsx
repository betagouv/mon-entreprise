import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Overlay from './Overlay'
import Banner from './Banner'
import { LinkButton } from 'Components/ui/Button'

export default function ShareSimulationBanner({
	getShareSearchParams,
}: {
	getShareSearchParams: () => URLSearchParams
}) {
	const [opened, setOpened] = useState(false)
	const { t } = useTranslation()

	if (typeof window === 'undefined') return null

	const getUrl = () =>
		[
			window.location.origin,
			window.location.pathname,
			'?',
			getShareSearchParams().toString(),
		].join('')

	const handleClose = () => {
		setOpened(false)
	}
	const onClick = () => {
		if (window.navigator.share) {
			window.navigator.share({
				title: document.title,
				text: t(
					'shareSimulation.navigatorShare',
					'Ma simulation Mon Entreprise'
				),
				url: getUrl(),
			})
		} else {
			setOpened(true)
		}
	}

	return (
		<Banner hidden={false} hideAfterFirstStep={false} icon="📤">
			<Trans i18nKey="shareSimulation.banner">
				Vous pouvez partager votre simulation :{' '}
				<LinkButton onClick={onClick} className="shareButton">
					Partager le lien
				</LinkButton>
			</Trans>
			{opened && (
				<Overlay onClose={handleClose}>
					<ShareSimulationPopup handleClose={handleClose} getUrl={getUrl} />
				</Overlay>
			)}
		</Banner>
	)
}

function ShareSimulationPopup({
	handleClose,
	getUrl,
}: {
	handleClose: () => void
	getUrl: () => string
}) {
	const textAreaRef: React.RefObject<HTMLTextAreaElement> = React.createRef()
	const { t } = useTranslation()

	useEffect(() => {
		const node = textAreaRef.current
		if (node) {
			node.select()
		}
	})

	return (
		<>
			<h2>{t('shareSimulation.modal.title', 'Votre lien de partage')}</h2>
			<textarea
				className="ui__ "
				ref={textAreaRef}
				style={{
					whiteSpace: 'nowrap',
				}}
			>
				{getUrl()}
			</textarea>
			{navigator.clipboard ? (
				<button
					className="ui__ small simple  button "
					onClick={() => {
						navigator.clipboard.writeText(getUrl())
						handleClose()
					}}
				>
					📋 {t('shareSimulation.modal.button', 'Copier le lien')}
				</button>
			) : (
				<p>
					{t(
						'shareSimulation.modal.helpText',
						'Le lien est déjà sélectionné, vous pouvez faire "copier".'
					)}
				</p>
			)}
		</>
	)
}
