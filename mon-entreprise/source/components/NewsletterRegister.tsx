import * as animate from 'Components/ui/animate'
import { usePersistingState } from 'Components/utils/persistState'
import { useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'

// We don't want to load the full sendinblue iframe, so we reimplement a simple
// logic to the a HTTP Post request to their URL with the email data.
const formInfos = {
	method: 'post',
	action:
		'https://b713d5c4.sibforms.com/serve/MUIEAEJui5ynU5AtcKQfxhATKzruDK8yC3YO4M56ltHV6LXHnZPESWHRjwK6Dtp3GgPqu49TljpGSa4Iy-BbaqLArDYDt5mEYtvOkrPD2b5siSNsthqi9kDz8wbljxKSDRbOQztsjyp3InDR1EUrTZJvyAk9YEkXtANb5upeHfN2VTF2m6lRiyOMF9B5VfD6jWGyxJaSNR8gsVQo?isAjax=1',
}

export default function NewsletterRegister() {
	const [userIsRegistered, setUserIsRegistered] = usePersistingState<boolean>(
		'app::newsletter::registered',
		false
	)
	const formElement = useRef<HTMLFormElement>(null)
	const [userJustRegistered, setUserJustRegistered] = useState(false)
	const { i18n } = useTranslation()

	const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
		evt.preventDefault()
		if (!formElement.current) {
			return
		}
		fetch(formInfos.action, {
			method: formInfos.method,
			body: new FormData(formElement.current),
		}).then(() => {
			setUserIsRegistered(true)
			setUserJustRegistered(true)
		})
	}

	if (userJustRegistered) {
		return (
			<animate.fromBottom>
				<div
					className="ui__ light-border"
					css={`
						text-align: center;
						background: var(--lighterColor);
					`}
				>
					<h4>
						{emoji('🎉')}{' '}
						<Trans i18nKey="newsletter.register.confirmation">
							Votre inscription est confirmée !
						</Trans>
					</h4>
				</div>
			</animate.fromBottom>
		)
	}

	if (i18n.language !== 'fr' || userIsRegistered) {
		return null
	}

	return (
		<div className='print-display-none'>
			<h2>
				<Trans i18nKey="newsletter.register.titre">Restez au courant</Trans>
			</h2>
			<div className="footer__newsletterContainer">
				<p>
					<Trans i18nKey="newsletter.register.description">
						Inscrivez-vous à notre newsletter pour être informé des nouveautés
						et accéder aux nouvelles fonctionnalités en avant-première.
					</Trans>
				</p>

				<form
					className="footer__registerContainer"
					ref={formElement}
					onSubmit={onSubmit}
					id="sib-form"
				>
					<div>
						<label htmlFor="EMAIL">
							<Trans>Votre adresse e-mail</Trans>
						</label>
						<div className="footer__registerField">
							<input type="email" name="EMAIL" id="EMAIL" />
							<button
								type="submit"
								name="subscribe"
								className="ui__ plain small button"
							>
								<Trans>S'inscrire</Trans>
							</button>
							<input type="hidden" name="locale" value={i18n.language} />
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}
