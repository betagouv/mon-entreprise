import { useLocation } from 'Components/router-adapter'
import { ScrollToElement } from 'Components/utils/Scroll'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

declare global {
	const $: any
}
export default function FeedbackForm() {
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
					messageThankYou: 'Merci de votre retour !',
					lang,
					attributes: [
						{
							display:
								"Que pouvons-nous améliorer afin de mieux répondre à vos attentes ? (ne pas mettre d'informations personnelles)",
							name: 'body',
							tag: 'textarea',
							placeholder: 'Your Message...',
							defaultValue: '',
							rows: 7,
						},
						{
							display: 'Nom',
							name: 'name',
							tag: 'input',
							type: 'text',
							defaultValue: '-',
						},
						{
							display: 'Email (pour recevoir une réponse)',
							name: 'email',
							tag: 'input',
							type: 'email',
							placeholder: 'Your Email',
						},
					],
				})
			}
			script.src = 'https://mon-entreprise.zammad.com/assets/form/form.js'
			document.body.appendChild(script)
		}, 100)
	}, [])

	return (
		<ScrollToElement onlyIfNotVisible>
			<div id="feedback-form"></div>
		</ScrollToElement>
	)
}
