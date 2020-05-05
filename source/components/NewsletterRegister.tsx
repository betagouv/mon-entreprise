import { usePersistingState } from 'Components/utils/persistState'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export default function Newsletter() {
	const [registered, setUserRegistered] = usePersistingState(
		'app::newsletter::registered',
		false
	)
	const { t, i18n } = useTranslation()
	const tracker = useContext(TrackerContext)

	const onSubmit = () => {
		tracker.push(['trackEvent', 'Newsletter', 'registered'])
		setTimeout(() => setUserRegistered(true), 0)
	}

	if (i18n.language !== 'fr' && registered) {
		return null
	}

	const sinscrire = t("S'inscrire")

	return (
		<>
			{' '}
			<h2>
				<Trans i18nKey="newsletter.register.titre">Restez informé</Trans>
			</h2>
			<div className="footer__newsletterContainer">
				<p>
					<Trans i18nKey="newsletter.register.description">
						Inscrivez-vous à notre newsletter mensuelle pour recevoir des{' '}
						<strong>conseils officiels sur la création d’entreprise</strong> et
						accéder aux nouvelles fonctionnalités en avant-première.
					</Trans>
				</p>

				<form
					className="footer__registerContainer"
					action="https://gouv.us13.list-manage.com/subscribe/post?u=732a4d1b0d2e8a1a1fd3d01db&amp;id=f146678e48"
					method="post"
					onSubmit={onSubmit}
					id="mc-embedded-subscribe-form"
					name="mc-embedded-subscribe-form"
					target="_blank"
				>
					<div>
						<label htmlFor="mce-EMAIL">
							<Trans>Votre adresse e-mail</Trans>
						</label>
						<div className="footer__registerField">
							<input type="email" name="EMAIL" id="mce-EMAIL" />
							<input
								className="ui__ plain small button"
								type="submit"
								value={typeof sinscrire === 'string' ? sinscrire : ''}
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
