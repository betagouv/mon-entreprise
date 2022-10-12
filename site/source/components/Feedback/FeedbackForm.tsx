import { ScrollToElement } from '@/components/utils/Scroll'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { sendMessageToCrisp } from '../../../../serverless-functions/functions/sendMessageToCrisp'

declare global {
	interface JQuery {
		ZammadForm(options: any): void
	}
}

// TODO: we could implement the form logic ourselves to avoid including
// https://mon-entreprise.zammad.com and https://code.jquery.com scripts
export default function FeedbackForm() {
	// const tracker = useContext(TrackerContext)
	const pathname = useLocation().pathname
	const page = pathname.split('/').slice(-1)[0]
	const lang = useTranslation().i18n.language

	const { t } = useTranslation()

	const sendMessage = async () => {
		await fetch('/.netlify/functions/sendMessageToCrisp', {
			method: 'post',
			body: JSON.stringify({
				message: 'tutut',
				email: 'test@test.com',
			}),
		})
	}

	return (
		<ScrollToElement onlyIfNotVisible>
			<StyledFeedback id="feedback-form"></StyledFeedback>
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<button onClick={sendMessage} type="button">
				Clikc
			</button>
			<iframe
				title={t('Formulaire de contact pour faire une suggestion')}
				src={`https://plugins.crisp.chat/urn:crisp.im:contact-form:0/contact/d8247abb-cac5-4db6-acb2-cea0c00d8524?locale=${lang}&page=${page}`}
				referrerPolicy="origin"
				sandbox="allow-forms allow-popups allow-scripts"
				width="100%"
				height="440px"
				frameBorder="0"
			></iframe>
		</ScrollToElement>
	)
}

const StyledFeedback = styled.div`
	font-size: 1rem;
	line-height: 1.5rem;
	font-family: ${({ theme }) => theme.fonts.main};
	text-align: left;

	textarea,
	input {
		width: 100%;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		padding: ${({ theme }) => theme.spacings.sm};
		margin-top: ${({ theme }) => theme.spacings.xs};
		border-radius: ${({ theme }) => theme.box.borderRadius};
		border: 1px solid ${({ theme }) => theme.colors.extended.grey[500]};
	}
`
