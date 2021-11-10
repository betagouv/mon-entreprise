import { Checkbox } from 'DesignSystem/field'
import PopoverWithTrigger from 'DesignSystem/PopoverWithTrigger'
import { Link } from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useCallback, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TrackingContext, TrackPage } from '../../../ATInternetTracking'
import safeLocalStorage from '../../../storage/safeLocalStorage'

export default function Privacy({ label }: { label?: string }) {
	const tracker = useContext(TrackingContext)
	const [valueChanged, setValueChanged] = useState(false)
	const { t } = useTranslation()
	const handleChange = useCallback(
		(evt) => {
			if (evt.target.checked) {
				tracker.privacy.setVisitorOptout()
				safeLocalStorage.setItem('tracking:do_not_track', '1')
			} else {
				tracker.privacy.setVisitorMode('cnil', 'exempt')
				safeLocalStorage.setItem('tracking:do_not_track', '0')
			}
			setValueChanged(true)
		},
		[setValueChanged, tracker.privacy]
	)

	return (
		<PopoverWithTrigger
			trigger={(propsToDispatch) => (
				<Link {...propsToDispatch}>
					{label ?? <Trans>Gestion des données personnelles</Trans>}
				</Link>
			)}
			title={t('privacyContent.title', 'Données personnelles')}
		>
			<Trans i18nKey="privacyContent.texte">
				<TrackPage chapter1="informations" name={'donnees_personnelles'} />
				<Body>
					Nous recueillons des statistiques anonymes sur l'utilisation du site,
					que nous utilisons dans le seul but d'améliorer le service,
					conformément aux{' '}
					<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
						recommandations de la CNIL
					</a>{' '}
					et au règlement RGPD. Ce sont les seules données qui quittent votre
					navigateur.
				</Body>
				<Body>
					Vous pouvez vous soustraire de cette mesure d'utilisation du site
					ci-dessous :
				</Body>
				<Body>
					<Checkbox
						name="opt-out mesure audience"
						onChange={handleChange}
						defaultSelected={tracker.privacy.getVisitorMode().name === 'optout'}
					>
						Je souhaite ne pas envoyer de données anonymes sur mon utilisation
						du site à des fins de mesures d'audience
					</Checkbox>
				</Body>
			</Trans>
			{valueChanged && (
				<small className="ui__  label ">
					<Trans i18nKey="privacyContent.ok">
						Vos préférences ont bien été enregistrées
					</Trans>
				</small>
			)}
		</PopoverWithTrigger>
	)
}
