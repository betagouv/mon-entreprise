import { ScrollToElement } from '@/components/utils/Scroll'
import { TextAreaField, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Body } from '@/design-system/typography/paragraphs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const SHORT_MAX_LENGTH = 254

export default function FeedbackForm() {
	const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const pathname = useLocation().pathname
	const page = pathname.split('/').slice(-1)[0]

	const { t } = useTranslation()

	const sendMessage = async () => {
		setIsLoading(true)
		const messageValue = (
			document.getElementById('message') as HTMLTextAreaElement
		)?.value
		const emailValue = (document.getElementById('email') as HTMLInputElement)
			?.value

		try {
			await fetch(`/server-functions/send-crisp-message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					subject: `Suggestion sur la page : ${page}`,
					message: messageValue,
					email: emailValue,
				}),
			})
			setIsSubmittedSuccessfully(true)
		} catch (e) {
			// Show error message
		}
	}

	return (
		<ScrollToElement onlyIfNotVisible>
			{isSubmittedSuccessfully && (
				<StyledBody>Merci de votre retour !</StyledBody>
			)}
			{!isSubmittedSuccessfully && (
				<StyledFeedback>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							void sendMessage()
						}}
					>
						<Body>
							Que pouvons-nous améliorer pour mieux répondre à vos attentes ?
						</Body>
						<StyledTextArea
							name="message"
							label={t('Votre message')}
							description={t(
								'Éviter de communiquer des informations personnelles'
							)}
							id="message"
							rows={7}
							isDisabled={isLoading}
						/>
						<StyledDiv>
							<StyledTextField
								id="email"
								name="email"
								type="email"
								label={t('Votre adresse e-mail')}
								description={t(
									'Renseigner une adresse e-mail pour recevoir une réponse'
								)}
								isDisabled={isLoading}
								maxLength={SHORT_MAX_LENGTH}
							/>
						</StyledDiv>
						<StyledButton isDisabled={isLoading} type="submit">
							{t('Envoyer')}
						</StyledButton>
					</form>
				</StyledFeedback>
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

const StyledBody = styled(Body)`
	font-size: 1.25rem;
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: center;
	padding: 1rem 0;
`

const StyledDiv = styled.div`
	margin-top: 1rem;
`
