import Overlay from 'Components/Overlay'
import { useCallback, useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import { TrackingContext, TrackPage } from '../../../ATInternetTracking'
import safeLocalStorage from '../../../storage/safeLocalStorage'

export default function Privacy({ label }: { label?: string }) {
	const [opened, setOpened] = useState(false)

	const handleClose = () => {
		setOpened(false)
	}
	const handleOpen = () => {
		setOpened(true)
	}

	return (
		<>
			<button onClick={handleOpen} className="ui__ link-button">
				{label ?? <Trans>Gestion des données personnelles</Trans>}
			</button>
			{opened && (
				<Overlay onClose={handleClose} style={{ textAlign: 'left' }}>
					<PrivacyContent />
				</Overlay>
			)}
		</>
	)
}

function PrivacyContent() {
	const tracker = useContext(TrackingContext)
	const [valueChanged, setValueChanged] = useState(false)
	const handleChange = useCallback(
		(evt) => {
			if (evt.target.checked) {
				tracker.privacy.setVisitorOptout()
				safeLocalStorage.setItem('tracking:do_not_track', 'true')
			} else {
				tracker.privacy.setVisitorMode('cnil', 'exempt')
				safeLocalStorage.setItem('tracking:do_not_track', 'false')
			}
			setValueChanged(true)
		},
		[setValueChanged, tracker.privacy]
	)

	return (
		<>
			<Trans i18nKey="privacyContent.texte">
				<TrackPage chapter1="informations" name={'donnees_personnelles'} />
				<h1>Données personnelles</h1>
				<p>
					Nous recueillons des statistiques anonymes sur l'utilisation du site,
					que nous utilisons dans le seul but d'améliorer le service,
					conformément aux{' '}
					<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
						recommandations de la CNIL
					</a>{' '}
					et au règlement RGPD. Ce sont les seules données qui quittent votre
					navigateur.
				</p>
				<p>
					Vous pouvez vous soustraire de cette mesure d'utilisation du site
					ci-dessous :
				</p>
				<p>
					<label>
						<input
							type="checkbox"
							name="opt-out mesure audience"
							onChange={handleChange}
							defaultChecked={
								tracker.privacy.getVisitorMode().name === 'optout'
							}
						/>{' '}
						Je souhaite ne pas envoyer de données anonymes sur mon utilisation
						du site à des fins de mesures d'audience
					</label>
				</p>
			</Trans>
			{valueChanged && (
				<small className="ui__  label ">
					<Trans i18nKey="privacyContent.ok">
						Vos préférences ont bien été enregistrées
					</Trans>
				</small>
			)}
		</>
	)
}
