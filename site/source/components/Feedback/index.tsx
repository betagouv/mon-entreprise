import Emoji from 'Components/utils/Emoji'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import Popover from 'DesignSystem/Popover'
import { Strong } from 'DesignSystem/typography'
import { Link } from 'DesignSystem/typography/link'
import { Body, SmallBody } from 'DesignSystem/typography/paragraphs'
import React, { useCallback, useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import safeLocalStorage from '../../storage/safeLocalStorage'
import { INSCRIPTION_LINK } from '../layout/Footer/InscriptionBetaTesteur'
import './Feedback.css'
import Form from './FeedbackForm'

type PageFeedbackProps = {
	blacklist?: Array<string>
	customMessage?: React.ReactNode
	customEventName?: string
}

const localStorageKey = (url: string) => `app::feedback::v3::${url}`
const setFeedbackGivenForUrl = (url: string) => {
	safeLocalStorage.setItem(
		localStorageKey(url),
		JSON.stringify(new Date().toISOString())
	)
}
// Ask for feedback again after 4 months
const askFeedback = (url: string) => {
	const previousFeedbackDate = safeLocalStorage.getItem(localStorageKey(url))
	if (!previousFeedbackDate) {
		return true
	}
	return (
		new Date(previousFeedbackDate) <
		new Date(new Date().setMonth(new Date().getMonth() - 4))
	)
}

const Container = styled.div`
	padding: 1rem 0 1.5rem 0;
	text-align: center;
`

export default function PageFeedback({ customMessage }: PageFeedbackProps) {
	const url = useLocation().pathname
	const [display, setDisplay] = useState(askFeedback(url))
	const [state, setState] = useState({
		showForm: false,
		showThanks: false,
	})
	const ATTracker = useContext(TrackingContext)

	const handleFeedback = useCallback(
		(rating: 'mauvais' | 'moyen' | 'bien' | 'très bien') => {
			setFeedbackGivenForUrl(url)
			ATTracker.click.set({
				chapter1: 'satisfaction',
				type: 'action',
				name: rating,
			})
			ATTracker.dispatch()
			const askDetails = ['mauvais', 'moyen'].includes(rating)
			setState({
				showThanks: !askDetails,
				showForm: askDetails,
			})
		},
		[ATTracker, url]
	)

	const openSuggestionForm = useCallback(() => {
		setState({ ...state, showForm: true })
	}, [state])

	if (!display) {
		return null
	}

	return (
		<Container>
			{!state.showForm && !state.showThanks && (
				<>
					<SmallBody>
						{customMessage || (
							<Trans i18nKey="feedback.question">
								Êtes-vous satisfait de cette page ?
							</Trans>
						)}{' '}
					</SmallBody>
					<div
						css={`
							display: flex;
							flex-wrap: wrap;
							justify-content: center;
						`}
					>
						<div>
							<EmojiButton onClick={() => handleFeedback('mauvais')}>
								<Emoji emoji="🙁" />
							</EmojiButton>
							<EmojiButton onClick={() => handleFeedback('moyen')}>
								<Emoji emoji="😐" />
							</EmojiButton>
						</div>
						<div>
							<EmojiButton onClick={() => handleFeedback('bien')}>
								<Emoji emoji="🙂" />
							</EmojiButton>
							<EmojiButton onClick={() => handleFeedback('très bien')}>
								<Emoji emoji="😀" />
							</EmojiButton>
						</div>
					</div>
				</>
			)}
			{(state.showThanks || state.showForm) && (
				<button
					onClick={() => setDisplay(false)}
					style={{
						position: 'absolute',
						right: '-2.4rem',
						top: '-0.6rem',
						fontSize: '200%',
					}}
					css={`
						:hover {
							opacity: 0.8;
						}
					`}
					aria-label="close"
				>
					<small>×</small>
				</button>
			)}
			{state.showThanks && (
				<>
					<Body>
						<Strong>
							<Trans i18nKey="feedback.thanks">Merci de votre retour !</Trans>
						</Strong>
					</Body>
					<Body>
						<Trans i18nKey="feedback.beta-testeur">
							Pour continuer à donner votre avis et accéder aux nouveautés en
							avant-première,{' '}
							<Link href={INSCRIPTION_LINK}>
								inscrivez-vous sur la liste des beta-testeur
							</Link>
						</Trans>
					</Body>
				</>
			)}
			{state.showForm ? (
				<Popover
					isOpen
					title="Votre avis nous interesse"
					isDismissable
					onClose={() => setState({ showThanks: true, showForm: false })}
				>
					<Form />
				</Popover>
			) : (
				<>
					<Spacing md />
					<Button onPress={openSuggestionForm} color="tertiary" size="XS" light>
						<Trans i18nKey="feedback.reportError">Faire une suggestion</Trans>
					</Button>
				</>
			)}
		</Container>
	)
}

const EmojiButton = styled.button`
	font-size: 1.5rem;
	padding: 0.6rem;
	transition: transform 0.05s;
	will-change: transform;
	:hover {
		transform: scale(1.3);
	}
`
