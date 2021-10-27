import Emoji from 'Components/utils/Emoji'
import { Button } from 'DesignSystem/buttons'
import { Body } from 'DesignSystem/typography/paragraphs'
import React, { useCallback, useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TrackingContext } from '../../ATInternetTracking'
import safeLocalStorage from '../../storage/safeLocalStorage'
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
					<Body>
						{customMessage || (
							<Trans i18nKey="feedback.question">
								Êtes-vous satisfait de cette page ?
							</Trans>
						)}{' '}
					</Body>
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
				<Body>
					<Trans i18nKey="feedback.thanks">Merci de votre retour !</Trans>
				</Body>
			)}
			{state.showForm ? (
				<Form />
			) : (
				<div
					css={`
						padding-top: 1rem;
					`}
				>
					<Button onClick={openSuggestionForm} color="tertiary" size="XS" light>
						<Trans i18nKey="feedback.reportError">Faire une suggestion</Trans>
					</Button>
				</div>
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
