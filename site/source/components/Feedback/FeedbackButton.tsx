import { useCallback, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { TrackingContext } from '@/ATInternetTracking'
import { Body } from '@/design-system/typography/paragraphs'

import * as safeLocalStorage from '../../storage/safeLocalStorage'
import Emoji from '../utils/Emoji'
import FeedbackRating, { Feedback } from './FeedbackRating'

const localStorageKey = (url: string) => `app::feedback::v3::${url}`
const setFeedbackGivenForUrl = (url: string) => {
	safeLocalStorage.setItem(
		localStorageKey(url),
		JSON.stringify(new Date().toISOString())
	)
}

const FeedbackButton = () => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [isShowingThankMessage, setIsShowingThankMessage] = useState(false)
	const [isShowingSuggestionForm, setIsShowingSuggestionForm] = useState(false)
	const { t } = useTranslation()
	const url = useLocation().pathname
	const tag = useContext(TrackingContext)

	const submitFeedback = useCallback(
		(rating: Feedback) => {
			setFeedbackGivenForUrl(url)
			tag.events.send('click.action', {
				click_chapter1: 'satisfaction',
				click: rating,
			})
			const askDetails = ['mauvais', 'moyen'].includes(rating)
			setIsShowingThankMessage(!askDetails)
			setIsShowingSuggestionForm(askDetails)
		},
		[tag, url]
	)

	if (isFormOpen) {
		return (
			<Container>
				<h4>
					<Trans>Un avis sur cette page ?</Trans>
				</h4>
				<Body>On vous écoute.</Body>

				<FeedbackRating submitFeedback={submitFeedback} />
			</Container>
		)
	}

	return (
		<StyledButton
			aria-label={t('Noter la simulation')}
			onClick={() => setIsFormOpen(true)}
		>
			<Emoji emoji="👋" />
		</StyledButton>
	)
}

const StyledButton = styled.button`
	width: 4.75rem;
	height: 4.75rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 2.5rem 0 0 2.5rem;
	position: -webkit-sticky; /* Safari */
	position: sticky;
	top: 10.5rem;
	right: 0;
	left: 100%;
	z-index: 1;
	font-size: 2rem;
	border: none;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};

	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[800]};

		& img {
			animation: wiggle 2.5s infinite;
			transform-origin: 70% 70%;
		}
	}

	@keyframes wiggle {
		0% {
			transform: rotate(0deg);
		}
		10% {
			transform: rotate(14deg);
		} /* The following five values can be played with to make the waving more or less extreme */
		20% {
			transform: rotate(-8deg);
		}
		30% {
			transform: rotate(14deg);
		}
		40% {
			transform: rotate(-4deg);
		}
		50% {
			transform: rotate(10deg);
		}
		60% {
			transform: rotate(0deg);
		} /* Reset for the last half to pause */
		100% {
			transform: rotate(0deg);
		}
	}
`

const Container = styled.div`
	width: 16.375rem;
	height: 12.75rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
`

export default FeedbackButton
