import FocusTrap from 'focus-trap-react'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Emoji, FocusStyle } from '@/design-system'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { ForceThemeProvider } from '../utils/DarkModeContext'
import { Feedback } from './Feedback'

const FeedbackButton = ({ isEmbedded }: { isEmbedded?: boolean }) => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const { t } = useTranslation()
	const containerRef = useRef<HTMLElement | null>(null)
	const [feedbackFormIsOpened, setFeedbackFormIsOpened] = useState(false)
	useOnClickOutside(
		containerRef,
		() => !feedbackFormIsOpened && setIsFormOpen(false)
	)

	const buttonRef = useRef() as MutableRefObject<HTMLButtonElement | null>

	const handleClose = () => {
		setIsFormOpen(false)
		setTimeout(() => {
			if (buttonRef.current) {
				buttonRef.current.focus()
			}
		})
	}

	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				handleClose()
			}
		}
		if (isFormOpen) {
			document.addEventListener('keydown', closeOnEscape)
		} else {
			document.removeEventListener('keydown', closeOnEscape)
		}
	}, [isFormOpen])

	if (isFormOpen) {
		return (
			<Section ref={containerRef} $isEmbedded={isEmbedded} aria-expanded={true}>
				<FocusTrap>
					<ForceThemeProvider forceTheme="dark">
						<CloseButtonContainer>
							<CloseButton
								onClick={handleClose}
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
						<Feedback
							onEnd={() => {
								if (!feedbackFormIsOpened) {
									setIsFormOpen(false)
								}
								setFeedbackFormIsOpened(false)
							}}
							onFeedbackFormOpen={() => setFeedbackFormIsOpened(true)}
						/>
					</ForceThemeProvider>
				</FocusTrap>
			</Section>
		)
	}

	return (
		<StyledButton
			ref={buttonRef}
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

const StyledButton = styled.button<{
	$isEmbedded?: boolean
}>`
	position: fixed;
	top: ${({ $isEmbedded }) => ($isEmbedded ? '2rem' : '20%')};
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

const Section = styled.section<{ $isEmbedded?: boolean }>`
	position: fixed;
	top: 20%;
	${({ $isEmbedded }) => ($isEmbedded ? `top: 2rem;` : '')}
	right: 0;
	width: 17.375rem;
	background-color: ${({ theme }) => theme.colors.bases.primary[700]};
	border-radius: 2rem 0 0 2rem;

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
