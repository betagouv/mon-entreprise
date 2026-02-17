import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { usePianoTracking } from '@/components/ATInternetTracking'
import {
	Body,
	Button,
	Emoji,
	H4,
	Popover,
	Spacing,
	Strong,
} from '@/design-system'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import * as safeLocalStorage from '../../storage/safeLocalStorage'
import { JeDonneMonAvis } from '../JeDonneMonAvis'
import FeedbackForm from './FeedbackForm'
import FeedbackRating, { FeedbackT } from './FeedbackRating'
import { useFeedback } from './useFeedback'

const localStorageKey = (url: string) => `app::feedback::v3::${url}`
const setFeedbackGivenForUrl = (url: string) => {
	safeLocalStorage.setItem(
		localStorageKey(url),
		JSON.stringify(new Date().toISOString())
	)
}

// Ask for feedback again after 4 months
export const getShouldAskFeedback = (url: string) => {
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

export function Feedback({
	onEnd,
	onFeedbackFormOpen,
}: {
	onEnd?: () => void
	onFeedbackFormOpen?: () => void
}) {
	const [isShowingThankMessage, setIsShowingThankMessage] = useState(false)
	const [isShowingSuggestionForm, setIsShowingSuggestionForm] = useState(false)
	const [isNotSatisfied, setIsNotSatisfied] = useState(false)
	const { t } = useTranslation()
	const { currentPath } = useNavigation()
	const tag = usePianoTracking()

	const { absoluteSitePaths } = useSitePaths()
	const isSimulateurSalaire =
		currentPath.includes(absoluteSitePaths.simulateurs.salarié) ||
		currentPath.includes(IFRAME_SIMULATEUR_EMBAUCHE_PATH)

	const { shouldShowRater, customTitle } = useFeedback()

	const submitFeedback = useCallback(
		(rating: FeedbackT) => {
			setFeedbackGivenForUrl(currentPath)
			tag?.sendEvent('click.action', {
				click_chapter1: 'satisfaction',
				click: rating,
			})
			const isNotSatisfiedValue = ['mauvais', 'moyen'].includes(rating)
			if (isNotSatisfiedValue) {
				setIsNotSatisfied(true)
				onFeedbackFormOpen?.()
			}

			setIsShowingThankMessage(!isNotSatisfiedValue)
			setIsShowingSuggestionForm(isNotSatisfiedValue)
		},
		[tag, currentPath]
	)

	const shouldAskFeedback = getShouldAskFeedback(currentPath)

	return (
		<>
			{isShowingThankMessage || !shouldAskFeedback ? (
				<>
					<Body>
						<Strong>
							<Trans i18nKey="feedback.thanks">Merci de votre retour !</Trans>{' '}
							<Emoji emoji="🙌" />
						</Strong>
					</Body>
					{/* TODO : reactivate when we need new beta-testeurs
					<SmallBody>
						<Trans i18nKey="feedback.beta-testeur">
							Pour continuer à donner votre avis et accéder aux nouveautés en
							avant-première,{' '}
							<StyledLink
								href={INSCRIPTION_LINK}
								aria-label="inscrivez-vous sur la liste des beta-testeur, nouvelle fenêtre"
							>
								inscrivez-vous sur la liste des beta-testeur
							</StyledLink>
						</Trans>
					</SmallBody> */}
				</>
			) : (
				<>
					<H4 as="h2">
						{customTitle || <Trans>Un avis sur cette page ?</Trans>}
					</H4>

					{shouldShowRater && (
						<FeedbackRating submitFeedback={submitFeedback} />
					)}
				</>
			)}
			<Spacing lg />
			{isSimulateurSalaire ? (
				<JeDonneMonAvis light />
			) : (
				<div style={{ textAlign: 'center' }}>
					<Button
						color="tertiary"
						size="XXS"
						light
						aria-haspopup="dialog"
						onPress={() => {
							setIsShowingSuggestionForm(true)
							onFeedbackFormOpen?.()
						}}
					>
						<Trans i18nKey="feedback.reportError">Faire une suggestion</Trans>
					</Button>
				</div>
			)}
			{isShowingSuggestionForm && (
				<Popover
					isOpen
					isDismissable
					onClose={() => {
						setIsShowingSuggestionForm(false)
						setTimeout(() => onEnd?.())
					}}
					title={
						isNotSatisfied
							? t('Vos attentes ne sont pas remplies')
							: t('Votre avis nous intéresse')
					}
				>
					<FeedbackForm
						infoSlot={
							isNotSatisfied && (
								<Body>
									<Trans>
										Vous n’avez pas été satisfait(e) de votre expérience, nous
										en sommes désolé(e)s.
									</Trans>
								</Body>
							)
						}
					/>
				</Popover>
			)}
		</>
	)
}
