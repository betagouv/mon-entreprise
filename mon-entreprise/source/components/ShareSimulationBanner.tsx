import Animate from 'Components/ui/animate'
import { LinkButton } from 'Components/ui/Button'
import React, { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import { TrackingContext } from '../ATInternetTracking'
import Banner from './Banner'
import { useParamsFromSituation } from './utils/useSearchParamsSimulationSharing'

export default function ShareSimulationBanner() {
	const [opened, setOpened] = useState(false)
	const { t } = useTranslation()
	const tracker = useContext(TrackingContext)
	const situation = useSelector(situationSelector)
	const searchParams = useParamsFromSituation(situation)
	searchParams.set('utm_source', 'sharing')

	const shareAPIAvailable = !!window?.navigator?.share

	const getUrl = () =>
		[
			window.location.origin,
			window.location.pathname,
			'?',
			searchParams.toString(),
		].join('')

	const startSharing = async () => {
		if (shareAPIAvailable) {
			try {
				await window.navigator.share({
					title: document.title,
					text: t(
						'shareSimulation.navigatorShare',
						'Ma simulation Mon Entreprise'
					),
					url: getUrl(),
				})
			} catch {
				setOpened(true)
			}
		} else {
			setOpened(true)
		}
	}

	return (
		<Banner hideAfterFirstStep={false} icon="💬">
			{opened ? (
				<Animate.fromTop>
					<div>
						<span
							className="ui__ close-button"
							style={{ float: 'right' }}
							onClick={() => setOpened(false)}
						>
							&times;
						</span>
						<h3>
							{t('shareSimulation.modal.title', 'Votre lien de partage')}{' '}
						</h3>
						<p className="ui__ notice">
							<Trans key="shareSimulation.modal.notice">
								Voici le lien que vous pouvez envoyer pour accéder à votre
								simulation.
							</Trans>
						</p>
						<ShareSimulationPopup url={getUrl()} />
					</div>
				</Animate.fromTop>
			) : (
				<Trans i18nKey="shareSimulation.banner">
					Pour partager cette simulation :{' '}
					<LinkButton
						onClick={async () => {
							tracker.click.set({
								chapter1: 'feature:partage',
								type: 'action',
								name: 'démarré',
							})
							tracker.dispatch()
							await startSharing()
						}}
					>
						Générer un lien dédié
					</LinkButton>
				</Trans>
			)}
		</Banner>
	)
}

function ShareSimulationPopup({ url }: { url: string }) {
	const inputRef: React.RefObject<HTMLInputElement> = React.createRef()
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
			<input
				className="ui__ shareableLink"
				ref={inputRef}
				onFocus={selectInput}
				value={url}
			/>
			{navigator.clipboard ? (
				<button
					className="ui__ small simple link-button"
					style={{ marginLeft: '1rem' }}
					onClick={() => {
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
				</button>
			) : (
				<p className="ui notice">
					{t(
						'shareSimulation.modal.helpText',
						'Le lien est sélectionné, vous pouvez le copier/coller'
					)}
				</p>
			)}
		</>
	)
}
