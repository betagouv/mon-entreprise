import Emoji from '@/components/utils/Emoji'
import { Button } from '@/design-system/buttons'
import { Grid, Spacing } from '@/design-system/layout'
import Popover from '@/design-system/popover/Popover'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { CurrentSimulatorDataContext } from '@/pages/Simulateurs/metadata'
import React, { useCallback, useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TrackingContext } from '@/ATInternetTracking'
import * as safeLocalStorage from '../../storage/safeLocalStorage'
import { JeDonneMonAvis } from '../JeDonneMonAvis'
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

export default function PageFeedback({ customMessage }: PageFeedbackProps) {
	const url = useLocation().pathname
	const currentSimulatorData = useContext(CurrentSimulatorDataContext)
	const [state, setState] = useState({
		showForm: false,
		showThanks: false,
	})
	const tag = useContext(TrackingContext)

	const handleFeedback = useCallback(
		(rating: 'mauvais' | 'moyen' | 'bien' | 'très bien') => {
			setFeedbackGivenForUrl(url)
			tag.events.send('click.action', {
				click_chapter1: 'satisfaction',
				click: rating,
			})
			const askDetails = ['mauvais', 'moyen'].includes(rating)
			setState({
				showThanks: !askDetails,
				showForm: askDetails,
			})
		},
		[tag, url]
	)

	const openSuggestionForm = useCallback(() => {
		setState({ ...state, showForm: true })
	}, [state])

	return (
		<Container>
			{state.showThanks || !askFeedback(url) ? (
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
			) : (
				<>
					<SmallBody>
						{customMessage || (
							<Trans i18nKey="feedback.question">
								Êtes-vous satisfait de cette page ?
							</Trans>
						)}
					</SmallBody>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
						}}
					>
						<EmojiButton onClick={() => handleFeedback('mauvais')}>
							<Emoji
								emoji="🙁"
								aria-label="Pas satisfait, envoyer cette réponse"
								aria-hidden={false}
							/>
						</EmojiButton>
						<EmojiButton onClick={() => handleFeedback('moyen')}>
							<Emoji
								emoji="😐"
								aria-label="Moyennement satisfait, envoyer cette réponse"
								aria-hidden={false}
							/>
						</EmojiButton>
						<EmojiButton onClick={() => handleFeedback('bien')}>
							<Emoji
								emoji="🙂"
								aria-label="Plutôt satisfait, envoyer cette réponse"
								aria-hidden={false}
							/>
						</EmojiButton>
						<EmojiButton onClick={() => handleFeedback('très bien')}>
							<Emoji
								emoji="😀"
								aria-label="Très satisfait, envoyer cette réponse"
								aria-hidden={false}
							/>
						</EmojiButton>
					</div>
				</>
			)}
			{state.showForm && (
				<Popover
					isOpen
					title="Votre avis nous interesse"
					isDismissable
					onClose={() => setState({ showThanks: true, showForm: false })}
					small
				>
					<Form />
				</Popover>
			)}
			<Spacing md />
			<Grid container spacing={2} style={{ justifyContent: 'center' }}>
				<Grid item>
					{currentSimulatorData?.pathId === 'simulateurs.salarié' ? (
						<JeDonneMonAvis />
					) : (
						<Button
							onPress={openSuggestionForm}
							color="tertiary"
							size="XS"
							light
						>
							<Trans i18nKey="feedback.reportError">Faire une suggestion</Trans>
						</Button>
					)}
				</Grid>
			</Grid>
		</Container>
	)
}

const EmojiButton = styled.button`
	font-size: 1.5rem;
	padding: 0.6rem;
	border: none;
	background: none;
	transition: transform 0.05s;
	will-change: transform;
	:hover {
		transform: scale(1.3);
	}
`

const Container = styled.div`
	padding: 1rem 0 1.5rem 0;
	text-align: center;
`
