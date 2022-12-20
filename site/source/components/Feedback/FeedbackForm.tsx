import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ScrollToElement } from '@/components/utils/Scroll'
import { TextAreaField, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H1 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import Emoji from '../utils/Emoji'

type SubmitError = {
	message?: string
	email?: string
}

const SHORT_MAX_LENGTH = 254

const FeedbackThankYouContent = () => {
	const { t } = useTranslation()

	return (
		<>
			<StyledEmojiContainer role="img" aria-hidden>
				<span>
					<Emoji emoji="🙌" />
				</span>
			</StyledEmojiContainer>
			<H1>{t('Merci pour votre message !')}</H1>
			<Body>
				<Strong>Notre équipe prend en charge votre retour.</Strong>
			</Body>
			<Body>
				Nous avons à cœur d'améliorer en continu notre site,vos remarques nous
				sont donc très précieuses.
			</Body>
			<Spacing lg />
		</>
	)
}

export default function FeedbackForm({
	isNotSatisfied,
	title,
}: {
	isNotSatisfied: boolean
	title: string
}) {
	const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [submitError, setSubmitError] = useState<SubmitError | undefined>(
		undefined
	)
	const pathname = useLocation().pathname
	const page = pathname.split('/').slice(-1)[0]

	const { t } = useTranslation()

	const sendMessage = async ({
		message,
		email,
	}: {
		message: string
		email: string
	}) => {
		setIsLoading(true)

		try {
			await fetch(`/server/send-crisp-message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subject: `Suggestion sur la page : ${page}`,
					message,
					email,
				}),
			})
			setIsSubmittedSuccessfully(true)
		} catch (e) {
			// Show error message
		}
	}

	const requiredErrorMessage = t(
		'Veuillez entrer un message avant de soumettre le formulaire.'
	)

	const requiredErrorEmail = t('Veuillez renseigner votre adresse email.')

	const resetSubmitErrorField = (field: keyof SubmitError) =>
		submitError?.[field]
			? () =>
					setSubmitError((previousValue) => ({
						...previousValue,
						[field]: '',
					}))
			: undefined

	return (
		<ScrollToElement onlyIfNotVisible>
			{isSubmittedSuccessfully && <FeedbackThankYouContent />}
			{!isSubmittedSuccessfully && (
				<>
					<H1>{title}</H1>

					<StyledFeedback>
						<form
							onSubmit={(e) => {
								e.preventDefault()
								const message = (
									document.getElementById('message') as HTMLTextAreaElement
								)?.value
								const email = (
									document.getElementById('email') as HTMLInputElement
								)?.value

								// message et email sont requis
								const isMessageEmpty = !message || message === ''
								const isEmailEmpty = !email || email === ''

								if (isMessageEmpty || isEmailEmpty) {
									setSubmitError({
										message: isMessageEmpty ? requiredErrorMessage : '',
										email: isEmailEmpty ? requiredErrorEmail : '',
									})

									return
								}

								void sendMessage({ message, email })
							}}
						>
							{isNotSatisfied && (
								<>
									<Body>
										Vous n’avez pas été satisfait(e) de votre expérience, nous
										en sommes désolé(e)s.
									</Body>
								</>
							)}

							<Body>
								<Strong>
									Que pouvons-nous améliorer pour mieux répondre à vos attentes
									?
								</Strong>
							</Body>
							<StyledTextArea
								name="message"
								label={t('Votre message (requis)')}
								onChange={resetSubmitErrorField('message')}
								description={t(
									'Éviter de communiquer des informations personnelles'
								)}
								id="message"
								rows={7}
								isDisabled={isLoading}
								errorMessage={submitError?.message}
								placeholder={t(
									'Ex : Des informations plus claires, un calcul détaillé...'
								)}
							/>
							<StyledDiv>
								<StyledTextField
									id="email"
									name="email"
									type="email"
									label={t('Votre adresse e-mail (requise)')}
									description={t(
										'Renseigner une adresse e-mail pour recevoir une réponse'
									)}
									isDisabled={isLoading}
									maxLength={SHORT_MAX_LENGTH}
									autoComplete="email"
									errorMessage={submitError?.email}
									onChange={resetSubmitErrorField('email')}
								/>
							</StyledDiv>
							<StyledButton isDisabled={isLoading} type="submit">
								{t('Envoyer')}
							</StyledButton>
						</form>
					</StyledFeedback>
				</>
			)}
		</ScrollToElement>
	)
}

const StyledFeedback = styled.div`
	font-size: 1rem;
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: left;

	label {
		margin-bottom: 0.5rem;
		display: block;
	}
`

const StyledTextArea = styled(TextAreaField)`
	width: 100%;
	font-size: 1rem;
	line-height: 1.5rem;
	padding: ${({ theme }) => theme.spacings.sm};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledTextField = styled(TextField)`
	font-size: 1rem;
	line-height: 1.5rem;
	padding: ${({ theme }) => theme.spacings.sm};
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledButton = styled(Button)`
	margin-top: 1rem;
`

const StyledDiv = styled.div`
	margin-top: 1rem;
`

const StyledEmojiContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-top: 3rem;
	& > span {
		background-color: ${({ theme }) => theme.colors.extended.grey[200]};
		border-radius: 100%;
		width: 7.5rem;
		padding: 2rem;
		font-size: 3rem;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
`
