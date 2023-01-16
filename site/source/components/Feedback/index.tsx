import { useCallback, useContext, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { TrackingContext } from '@/ATInternetTracking'
import { Popover } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { FocusStyle } from '@/design-system/global-style'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useOnClickOutside } from '@/hooks/useClickOutside'
import { useSitePaths } from '@/sitePaths'

import * as safeLocalStorage from '../../storage/safeLocalStorage'
import { JeDonneMonAvis } from '../JeDonneMonAvis'
import { INSCRIPTION_LINK } from '../layout/Footer/InscriptionBetaTesteur'
import { useFeedback } from '../layout/Footer/useFeedback'
import FeedbackForm from './FeedbackForm'
import FeedbackRating, { Feedback } from './FeedbackRating'

const localStorageKey = (url: string) => `app::feedback::v3::${url}`
const setFeedbackGivenForUrl = (url: string) => {
	safeLocalStorage.setItem(
		localStorageKey(url),
		JSON.stringify(new Date().toISOString())
	)
}

// Ask for feedback again after 4 months
const getShouldAskFeedback = (url: string) => {
	const previousFeedbackDate = safeLocalStorage.getItem(localStorageKey(url))
	if (!previousFeedbackDate) {
		return true
	}

	return (
		new Date(previousFeedbackDate) <
		new Date(new Date().setMonth(new Date().getMonth() - 4))
	)
}

const IFRAME_SIMULATEUR_EMBAUCHE_PATH = '/iframes/simulateur-embauche'

const FeedbackButton = ({ isEmbedded }: { isEmbedded?: boolean }) => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [isShowingThankMessage, setIsShowingThankMessage] = useState(false)
	const [isShowingSuggestionForm, setIsShowingSuggestionForm] = useState(false)
	const [isNotSatisfied, setIsNotSatisfied] = useState(false)
	const { t } = useTranslation()
	const url = useLocation().pathname
	const tag = useContext(TrackingContext)
	const containerRef = useRef<HTMLElement | null>(null)

	const { absoluteSitePaths } = useSitePaths()
	const currentPath = useLocation().pathname
	const isSimulateurSalaire =
		currentPath.includes(absoluteSitePaths.simulateurs.salarié) ||
		currentPath.includes(IFRAME_SIMULATEUR_EMBAUCHE_PATH)

	const { shouldShowRater, customTitle } = useFeedback()

	useOnClickOutside(
		containerRef,
		() => !isShowingSuggestionForm && setIsFormOpen(false)
	)

	const submitFeedback = useCallback(
		(rating: Feedback) => {
			setFeedbackGivenForUrl(url)
			tag.events.send('click.action', {
				click_chapter1: 'satisfaction',
				click: rating,
			})
			const isNotSatisfiedValue = ['mauvais', 'moyen'].includes(rating)
			if (isNotSatisfiedValue) {
				setIsNotSatisfied(true)
			}

			setIsShowingThankMessage(!isNotSatisfiedValue)
			setIsShowingSuggestionForm(isNotSatisfiedValue)
		},
		[tag, url]
	)

	const shouldAskFeedback = getShouldAskFeedback(url)

	if (isFormOpen) {
		return (
			<Section ref={containerRef} $isEmbedded={isEmbedded} aria-expanded={true}>
				<CloseButtonContainer>
					<CloseButton
						onClick={() => setIsFormOpen(false)}
						aria-label={t('Fermer le module "Donner son avis"')}
					>
						Fermer
						<svg
							role="img"
							aria-hidden
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							style={{ pointerEvents: 'none' }}
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M6.69323 17.2996C6.30271 16.9091 6.30271 16.276 6.69323 15.8854L15.8856 6.69304C16.2761 6.30252 16.9093 6.30252 17.2998 6.69304C17.6904 7.08356 17.6904 7.71673 17.2998 8.10725L8.10744 17.2996C7.71692 17.6902 7.08375 17.6902 6.69323 17.2996Z"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M6.6635 6.69306C7.05402 6.30254 7.68719 6.30254 8.07771 6.69306L17.2701 15.8854C17.6606 16.276 17.6606 16.9091 17.2701 17.2997C16.8796 17.6902 16.2464 17.6902 15.8559 17.2997L6.6635 8.10727C6.27297 7.71675 6.27297 7.08359 6.6635 6.69306Z"
							/>
						</svg>
					</CloseButton>
				</CloseButtonContainer>
				{isShowingThankMessage || !shouldAskFeedback ? (
					<>
						<Body>
							<Strong>
								<Trans i18nKey="feedback.thanks">Merci de votre retour !</Trans>{' '}
								<Emoji emoji="🙌" />
							</Strong>
						</Body>
						<ThankYouText>
							<Trans i18nKey="feedback.beta-testeur">
								Pour continuer à donner votre avis et accéder aux nouveautés en
								avant-première,{' '}
								<StyledLink
									href={INSCRIPTION_LINK}
									aria-label="inscrivez-vous sur la liste des beta-testeur, nouvelle fenêtre"
									style={{ color: '#FFF' }}
								>
									inscrivez-vous sur la liste des beta-testeur
								</StyledLink>
							</Trans>
						</ThankYouText>
					</>
				) : (
					<>
						<StyledH4>
							{customTitle || <Trans>Un avis sur cette page ?</Trans>}
						</StyledH4>
						<StyledBody>On vous écoute.</StyledBody>
						<Spacing lg />
						{shouldShowRater && (
							<FeedbackRating submitFeedback={submitFeedback} />
						)}
					</>
				)}
				<Spacing lg />
				{isSimulateurSalaire ? (
					<JeDonneMonAvis light />
				) : (
					<Button
						color="tertiary"
						size="XXS"
						light
						aria-haspopup="dialog"
						onPress={() => {
							setIsShowingSuggestionForm(true)
						}}
					>
						<Trans i18nKey="feedback.reportError">Faire une suggestion</Trans>
					</Button>
				)}
				{isShowingSuggestionForm && (
					<Popover
						isOpen
						isDismissable
						onClose={() => {
							setIsShowingSuggestionForm(false)
							setTimeout(() => setIsFormOpen(false))
						}}
					>
						<FeedbackForm
							isNotSatisfied={isNotSatisfied}
							title={
								isNotSatisfied
									? t('Vos attentes ne sont pas remplies')
									: t('Votre avis nous intéresse')
							}
						/>
					</Popover>
				)}
			</Section>
		)
	}

	return (
		<StyledButton
			aria-label={t('Donner votre avis')}
			onClick={() => setIsFormOpen(true)}
			$isEmbedded={isEmbedded}
			aria-haspopup="dialog"
			aria-expanded={false}
		>
			<Emoji emoji="👋" />
		</StyledButton>
	)
}

const StyledButton = styled.button<{ $isEmbedded?: boolean }>`
	position: fixed;
	top: 10.5rem;
	${({ $isEmbedded }) => ($isEmbedded ? `top: 2rem;` : '')}
	right: 0;
	width: 3.75rem;
	height: 3.75rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 2.5rem 0 0 2.5rem;
	font-size: 1.75rem;
	border: none;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	z-index: 5;
	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.primary[800]};

		& img {
			animation: wiggle 2.5s infinite;
			transform-origin: 70% 70%;
		}
	}

	@media print {
		display: none;
	}

	@media (max-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		width: 3.25rem;
		height: 3.25rem;
		font-size: 1.5rem;
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
	&:focus {
		${FocusStyle}
	}
`

const StyledH4 = styled(H4)`
	margin: 0;
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	font-size: 1rem;
`

const StyledBody = styled(Body)`
	margin: 0;
`

const Section = styled.section<{ $isEmbedded?: boolean }>`
	position: fixed;
	top: 10.5rem;
	${({ $isEmbedded }) => ($isEmbedded ? `top: 2rem;` : '')}
	right: 0;
	width: 17.375rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 2rem 0 0 2rem;
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	& ${Body} {
		color: ${({ theme }) => theme.colors.extended.grey[100]};
	}
	padding: 1.5rem;
	padding-top: 0.75rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	z-index: 5;
	@media print {
		display: none;
	}
`

const ThankYouText = styled(Body)`
	font-size: 14px;
`

const CloseButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	background-color: transparent;
	width: 100%;
	margin-bottom: ${({ theme }) => theme.spacings.sm};
`

const CloseButton = styled.button`
	display: flex;
	align-items: center;
	background-color: transparent;
	border: none;
	padding: 0;
	color: ${({ theme }) => theme.colors.extended.grey[100]};

	svg {
		fill: ${({ theme }) => theme.colors.extended.grey[100]};
		width: 1.5rem;
	}
`

export default FeedbackButton
