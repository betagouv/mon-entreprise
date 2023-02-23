import { ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ScrollToElement } from '@/components/utils/Scroll'
import { Checkbox, TextAreaField, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H1 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import { useUrl } from '../ShareSimulationBanner'

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
			<H1>
				<Trans>Merci pour votre message !</Trans>
			</H1>
			<Body>
				<Strong>
					<Trans>Notre équipe prend en charge votre retour.</Trans>
				</Strong>
			</Body>
			<Body>
				<Trans>
					Nous avons à cœur d'améliorer en continu notre site,vos remarques nous
					sont donc très précieuses.
				</Trans>
			</Body>
			<Spacing lg />
		</>
	)
}

export default function FeedbackForm({
	title,
	infoSlot,
	description,
	placeholder,
	tags,
	hideShare,
}: {
	title: string
	infoSlot?: ReactNode
	description?: string
	placeholder?: string
	tags?: string[]
	hideShare?: boolean
}) {
	const url = useUrl()
	const urlParams = Array.from(new URL(url).searchParams.entries()).filter(
		([key]) => key !== 'utm_source'
	)
	const [share, setShare] = useState(false)
	const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [submitError, setSubmitError] = useState<SubmitError | undefined>(
		undefined
	)
	const pathname = decodeURI(useLocation().pathname)

	const { t } = useTranslation()

	const sendMessage = async ({
		message,
		email,
	}: {
		message: string
		email: string
	}) => {
		setIsLoading(true)
		const subjectTags = tags?.length ? ` [${tags?.join(',')}]` : ''

		try {
			await fetch(`/server/send-crisp-message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subject: `Page : ${pathname}${subjectTags}`,
					message: message + (share ? '\n\n' + url : ''),
					email,
				}),
			})
			setIsSubmittedSuccessfully(true)
		} catch (e) {
			// Show error message
			// eslint-disable-next-line no-console
			console.error(e)
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
					<H1 style={{ marginTop: '1rem' }}>{title}</H1>

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
							{infoSlot}

							<Body>
								<Strong>
									{description ??
										t(
											'Que pouvons-nous améliorer pour mieux répondre à vos attentes ?'
										)}
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
								placeholder={
									placeholder ??
									t('Ex : Des informations plus claires, un calcul détaillé...')
								}
							/>

							{!hideShare && urlParams.length > 0 && (
								<Checkbox
									onChange={(isSelected) => setShare(isSelected)}
									label={t(
										'components.feedback.form.share.checkbox',
										'Je souhaite partager ma dernière simulation pour vous aider à mieux me répondre.'
									)}
								/>
							)}

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

							<div style={{ textAlign: 'end' }}>
								<StyledButton isDisabled={isLoading} type="submit">
									{t('Envoyer')}
								</StyledButton>
							</div>
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
