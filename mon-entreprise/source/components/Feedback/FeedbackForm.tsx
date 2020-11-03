import { ScrollToElement } from 'Components/utils/Scroll'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { useContext, useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

type Props = { onEnd: () => void; onCancel: () => void }
declare global {
	const $: any
}
export default function FeedbackForm({ onEnd, onCancel }: Props) {
	// const tracker = useContext(TrackerContext)
	const pathname = useLocation().pathname
	const page = pathname.split('/').slice(-1)[0]
	const isSimulateur = pathname.includes('simulateurs')
	const lang = useTranslation().i18n.language
	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://code.jquery.com/jquery-2.1.4.min.js'

		document.body.appendChild(script)
		setTimeout(() => {
			const script = document.createElement('script')
			script.id = 'zammad_form_script'
			script.async = true
			script.onload = () => {
				$('#feedback-form').ZammadForm({
					messageTitle: `Remarque sur ${
						isSimulateur ? 'le simulateur' : 'la page'
					} ${page}`,
					messageSubmit: 'Envoyer',
					messageThankYou:
						'Merci pour votre retour ! Vous pouvez aussi nous contacter directement à contact@mon-entreprise.beta.gouv.fr',
					lang,
					attributes: [
						{
							display: 'Message',
							name: 'body',
							tag: 'textarea',
							placeholder: 'Your Message...',
							defaultValue: '',
							rows: 7
						},
						{
							display: 'Nom',
							name: 'name',
							tag: 'input',
							type: 'text',
							defaultValue: '-'
						},
						{
							display: 'Email (pour recevoir notre réponse)',
							name: 'email',
							tag: 'input',
							type: 'email',
							placeholder: 'Your Email'
						}
					]
				})
			}
			script.src = 'https://mon-entreprise.zammad.com/assets/form/form.js'
			document.body.appendChild(script)
		}, 100)
		// tracker.push(['trackEvent', 'Feedback', 'written feedback submitted'])
	}, [])

	return (
		<ScrollToElement onlyIfNotVisible>
			<div style={{ textAlign: 'end' }}>
				<button
					onClick={() => onCancel()}
					className="ui__ link-button"
					style={{ textDecoration: 'none', marginLeft: '0.3rem' }}
					aria-label="close"
				>
					X
				</button>
			</div>

			<p>
				<Trans i18nKey="feedback.bad.form.headline">
					Votre retour nous est précieux afin d'améliorer ce site en continu.
					Sur quoi devrions nous travailler afin de mieux répondre à vos
					attentes ?
				</Trans>
			</p>
			<div id="feedback-form"></div>
		</ScrollToElement>
	)
}
