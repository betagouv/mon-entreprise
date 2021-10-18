import { H3 } from 'DesignSystem/typography/heading'
import React, { useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { TrackingContext } from '../ATInternetTracking'
import Banner from './Banner'
import ExportSimulationBanner from './ExportSimulationBanner'
import { FromTop } from './ui/animate'
import { useParamsFromSituation } from './utils/useSearchParamsSimulationSharing'

export function useUrl() {
	const situation = useSelector(situationSelector)
	const searchParams = useParamsFromSituation(situation)
	searchParams.set('utm_source', 'sharing')
	return [
		window.location.origin,
		window.location.pathname.replace('iframes/', ''),
		'?',
		searchParams.toString(),
	].join('')
}

export default function ShareOrSaveSimulationBanner() {
	const [opened, setOpened] = useState(false)
	const { t } = useTranslation()
	const tracker = useContext(TrackingContext)
	const shareAPIAvailable = !!window?.navigator?.share
	const url = useUrl()
	const startSharing = async () => {
		if (shareAPIAvailable) {
			try {
				await window.navigator.share({
					title: document.title,
					text: t(
						'shareSimulation.navigatorShare',
						'Ma simulation Mon Entreprise'
					),
					url,
				})
			} catch {
				setOpened(true)
			}
		} else {
			setOpened(true)
		}
	}

	return opened ? (
		<FromTop>
			<div style={{ margin: '2rem 0' }}>
				<button
					className="ui__ close-button"
					style={{ float: 'right', fontSize: '1.5em', fontWeight: 200 }}
					onClick={() => setOpened(false)}
				>
					&times;
				</button>
				<H3>{t('shareSimulation.modal.title', 'Votre lien de partage')} </H3>
				<p className="ui__ notice">
					<Trans key="shareSimulation.modal.notice">
						Voici le lien que vous pouvez envoyer pour accéder à votre
						simulation.
					</Trans>
				</p>
				<ShareSimulationPopup url={url} />
			</div>
		</FromTop>
	) : (
		<SharingTools className="ui__ print-display-none">
			<Banner hideAfterFirstStep={false} icon="💬">
				<Trans i18nKey="shareSimulation.banner">
					<button
						className="ui__ simple small button"
						onClick={() => {
							tracker.click.set({
								chapter1: 'feature:partage',
								type: 'action',
								name: 'démarré',
							})
							tracker.dispatch()
							startSharing()
						}}
					>
						Générer un lien de partage
					</button>
				</Trans>
			</Banner>
			<ExportSimulationBanner />
		</SharingTools>
	)
}

const SharingTools = styled.div`
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	margin: 0.5rem 0;
`

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
