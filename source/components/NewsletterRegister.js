import { T } from 'Components'
import { usePersistingState } from 'Components/utils/persistState'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

export default function Newsletter() {
	const [registered, setUserRegistered] = usePersistingState(
		'app::newsletter::registered',
		false
	)
	const { t } = useTranslation()
	const tracker = useContext(TrackerContext)

	const onSubmit = () => {
		tracker.push(['trackEvent', 'Newsletter', 'registered'])
		setTimeout(() => setUserRegistered(true), 0)
	}

	if (registered) {
		return null
	}

	return (
		<>
			{' '}
			<h2>
				<T k="newsletter.register.titre">Restez informé</T>
			</h2>
			<div className="footer__newsletterContainer">
				<p>
					<T k="newsletter.register.description">
						Inscrivez-vous à notre newsletter mensuelle pour recevoir des{' '}
						<strong>conseils officiels sur la création d’entreprise</strong> et
						accéder aux nouvelles fonctionnalités en avant-première.
					</T>
				</p>

				<form
					className="footer__registerContainer"
					action="https://gouv.us13.list-manage.com/subscribe/post?u=732a4d1b0d2e8a1a1fd3d01db&amp;id=f146678e48"
					method="post"
					onSubmit={onSubmit}
					id="mc-embedded-subscribe-form"
					name="mc-embedded-subscribe-form"
					target="_blank">
					<div>
						<label htmlFor="mce-EMAIL">
							<T>Votre adresse e-mail</T>
						</label>
						<div className="footer__registerField">
							<input type="email" name="EMAIL" id="mce-EMAIL" />
							<input
								className="ui__ plain small button"
								type="submit"
								value={t("S'inscrire")}
								name="subscribe"
								id="mc-embedded-subscribe"
							/>
						</div>
					</div>
				</form>
			</div>
		</>
	)
}
