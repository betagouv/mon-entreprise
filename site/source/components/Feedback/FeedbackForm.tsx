import { ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import ScrollToElement from '@/components/utils/Scroll/ScrollToElement'
import {
	Body,
	Button,
	Checkbox,
	Emoji,
	H1,
	H4,
	Link,
	Message,
	Spacing,
	Strong,
	TextAreaField,
	TextField,
} from '@/design-system'
import { useUrl } from '@/hooks/useUrl'
import { useNavigation } from '@/lib/navigation'

type SubmitError = {
	message?: string
	email?: string
}

const SHORT_MAX_LENGTH = 254
const EMAIL_REGEX =
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\.[a-zA-Z]{2,})?$/

const FeedbackThankYouContent = () => {
	return (
		<>
			<StyledEmojiContainer role="img" aria-hidden>
				<span>
					<Emoji emoji="🙌" />
				</span>
			</StyledEmojiContainer>
			<H1>
				<Trans i18nKey={'feedback.success.title'}>
					Merci pour votre message !
				</Trans>
			</H1>
			<Body>
				<Strong>
					<Trans i18nKey={'feedback.success.body1'}>
						Notre équipe prend en charge votre retour.
					</Trans>
				</Strong>
			</Body>
			<Body>
				<Trans i18nKey={'feedback.success.body2'}>
					Nous avons à cœur d'améliorer en continu notre site, vos remarques
					nous sont donc très précieuses.
				</Trans>
			</Body>
			<Spacing lg />
		</>
	)
}

const FeedbackRequestErrorContent = ({
	statusCode,
}: {
	statusCode: number
}) => {
	const { t } = useTranslation()

	return (
		<>
			<Message type="error">
				<Trans i18nKey={'feedback.error.title'}>
					<H4>Une erreur est survenue pendant l’envoi du message</H4>
				</Trans>
				<Body>
					<Trans i18nKey={'feedback.error.description'}>
						Le message n’a pas pu être envoyé (status code {{ statusCode }}).
						Veuillez réessayer ou nous contacter par mail à l’adresse{' '}
						<Link
							href="mailto:contact@mon-entreprise.beta.gouv.fr"
							aria-label={t(
								'error.contact',
								'Envoyer un courriel à contact@mon-entreprise.beta.gouv.fr, nouvelle fenêtre'
							)}
						>
							contact@mon-entreprise.beta.gouv.fr
						</Link>
						.
					</Trans>
				</Body>
			</Message>
		</>
	)
}

export default function FeedbackForm({
	infoSlot,
	description,
	placeholder,
	tags,
	hideShare,
	additionalData,
}: {
	infoSlot?: ReactNode
	description?: ReactNode
	placeholder?: string
	tags?: string[]
	hideShare?: boolean
	additionalData?: string
}) {
	const url = useUrl()
	const urlParams = Array.from(new URL(url).searchParams.entries())
	const [share, setShare] = useState(false)
	const [requestStatusCode, setRequestStatusCode] = useState<null | number>(
		null
	)
	const [isLoading, setIsLoading] = useState(false)
	const [submitError, setSubmitError] = useState<SubmitError | undefined>(
		undefined
	)
	const { currentPath } = useNavigation()
	const pathname = decodeURI(currentPath)

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
			const result = await fetch(`/server/send-crisp-message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subject: `Page : ${pathname}${subjectTags}`,
					message:
						message +
						(share ? '\n\n' + url : '') +
						(additionalData ? '\n\n' + additionalData : ''),
					email,
				}),
			})
			setIsLoading(false)
			setRequestStatusCode(result.status)
		} catch (e) {
			// Show error message
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const requiredMessageError = t(
		'components.feedback.form.message.error',
		'Veuillez entrer un message avant de soumettre le formulaire.'
	)

	const requiredEmailError = t(
		'components.feedback.form.email.error',
		'Veuillez renseigner votre adresse email. Exemple : contact@mon-entreprise.beta.gouv.fr'
	)

	const invalidEmailError = t(
		'components.feedback.form.email.invalid',
		'Veuillez renseigner une adresse email valide. Exemple : contact@mon-entreprise.beta.gouv.fr'
	)

	const resetSubmitErrorField = (field: keyof SubmitError) =>
		submitError?.[field]
			? () =>
					setSubmitError((previousValue) => ({ ...previousValue, [field]: '' }))
			: undefined

	return (
		<ScrollToElement onlyIfNotVisible>
			{requestStatusCode === 200 ? (
				<FeedbackThankYouContent />
			) : (
				<>
					{requestStatusCode !== null && (
						<FeedbackRequestErrorContent statusCode={requestStatusCode} />
					)}
					<StyledFeedback>
						<form
							noValidate
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
								const isEmailInvalid = !email.match(EMAIL_REGEX)

								const messageError = isMessageEmpty ? requiredMessageError : ''
								const emailError = isEmailEmpty
									? requiredEmailError
									: isEmailInvalid
									? invalidEmailError
									: ''

								if (isMessageEmpty || isEmailEmpty) {
									setSubmitError({
										message: messageError,
										email: emailError,
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
											'components.feedback.form.message.label',
											'Que pouvons-nous améliorer pour mieux répondre à vos attentes ?'
										)}
								</Strong>
							</Body>
							<StyledTextArea
								name="message"
								label={t('Votre message (requis)')}
								onChange={resetSubmitErrorField('message')}
								description={t(
									'components.feedback.form.message.explanations',
									'Évitez de communiquer des informations personnelles'
								)}
								id="message"
								rows={7}
								isDisabled={isLoading}
								errorMessage={submitError?.message}
								placeholder={
									placeholder ??
									t(
										'components.feedback.form.message.placeholder',
										'Exemple : Des informations plus claires, un calcul détaillé…'
									)
								}
							/>

							{!hideShare && urlParams.length > 0 && (
								<Checkbox
									id="checkbox-share"
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
									label={t(
										'components.feedback.form.email.format',
										'Votre adresse e-mail au format nom@domaine.fr (requise)'
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
									{t('components.feedback.form.send', 'Envoyer le message')}
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
	font-size: ${({ theme }) => theme.fontSizes.base};
	line-height: ${({ theme }) => theme.lineHeights.base};
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: left;

	label {
		margin-bottom: 0.5rem;
		display: block;
	}
`

const StyledTextArea = styled(TextAreaField)`
	width: 100%;
	font-size: ${({ theme }) => theme.fontSizes.base};
	line-height: ${({ theme }) => theme.lineHeights.base};
	padding: ${({ theme }) => theme.spacings.sm};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	font-family: ${({ theme }) => theme.fonts.main};
`

const StyledTextField = styled(TextField)`
	font-size: ${({ theme }) => theme.fontSizes.base};
	line-height: ${({ theme }) => theme.lineHeights.base};
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
