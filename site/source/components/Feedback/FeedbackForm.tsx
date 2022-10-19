import { ScrollToElement } from '@/components/utils/Scroll'
import { TextAreaField, TextField } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

// TODO: we could implement the form logic ourselves to avoid including
// https://mon-entreprise.zammad.com and https://code.jquery.com scripts
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
			await fetch(`/send-crisp-message`, {
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
			{isSubmittedSuccessfully && <StyledP>Merci de votre retour !</StyledP>}
			{!isSubmittedSuccessfully && (
				<StyledFeedback>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							void sendMessage()
						}}
					>
						<div>
							<label htmlFor="message">
								{t(
									"Que pouvons-nous améliorer afin de mieux répondre à vos attentes ? (ne pas mettre d'informations personnelles)"
								)}
							</label>
							<StyledTextArea
								name="message"
								id="message"
								placeholder={t('Votre message')}
								rows={7}
							/>
						</div>
						<StyledDiv>
							<label htmlFor="email">
								{t('E-mail (pour recevoir une réponse)')}
							</label>
							<StyledTextField
								id="email"
								name="email"
								type="email"
								placeholder={t('Votre adresse e-mail')}
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

const StyledP = styled.p`
	font-size: 1.25rem;
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: center;
	padding: 1rem 0;
`

const StyledDiv = styled.div`
	margin-top: 1rem;
`
