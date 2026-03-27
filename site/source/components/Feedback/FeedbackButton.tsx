import FocusTrap from 'focus-trap-react'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { CrossIcon, Emoji, FocusStyle } from '@/design-system'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

import { ForceThemeProvider } from '../utils/DarkModeContext'
import { Feedback } from './Feedback'

export const FeedbackButton = ({ isEmbedded }: { isEmbedded?: boolean }) => {
	const [isPanelOpen, setIsPanelOpen] = useState(false)
	const { t } = useTranslation()
	const containerRef = useRef<HTMLElement | null>(null)
	const [feedbackFormIsOpened, setFeedbackFormIsOpened] = useState(false)
	useOnClickOutside(
		containerRef,
		() => !feedbackFormIsOpened && setIsPanelOpen(false)
	)

	const buttonRef = useRef() as MutableRefObject<HTMLButtonElement | null>

	const handleClose = () => {
		setIsPanelOpen(false)
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
		if (isPanelOpen) {
			document.addEventListener('keydown', closeOnEscape)
		} else {
			document.removeEventListener('keydown', closeOnEscape)
		}
	}, [isPanelOpen])

	if (isPanelOpen) {
		return (
			<Section ref={containerRef} $isEmbedded={isEmbedded} aria-expanded={true}>
				<FocusTrap>
					<ForceThemeProvider forceTheme="dark">
						<CloseButtonContainer>
							<CloseButton onClick={handleClose} aria-expanded={true}>
								Fermer
								<CrossIcon />
							</CloseButton>
						</CloseButtonContainer>
						<Feedback
							onEnd={() => {
								if (!feedbackFormIsOpened) {
									setIsPanelOpen(false)
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
			onClick={() => setIsPanelOpen(true)}
			$isEmbedded={isEmbedded}
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
