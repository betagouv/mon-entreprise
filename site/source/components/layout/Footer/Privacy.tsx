import { useCallback, useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { PopoverWithTrigger } from '@/design-system'
import { Checkbox } from '@/design-system/field'
import { Link } from '@/design-system/typography/link'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import { TrackPage, TrackingContext } from '../../../ATInternetTracking'
import * as safeLocalStorage from '../../../storage/safeLocalStorage'

export default function Privacy({ label }: { label?: string }) {
	const tracker = useContext(TrackingContext)
	const [valueChanged, setValueChanged] = useState(false)
	const { t } = useTranslation()

	const handleChange = useCallback(
		(checked: boolean) => {
			if (checked) {
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
			trigger={(buttonProps) => (
				<Link
					{...buttonProps}
					aria-haspopup="dialog"
					noUnderline
					textColor={(theme) => theme.colors.extended.grey[100]}
				>
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
					<Link
						href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience"
						aria-label={t(
							'privacyContent.recommandationsAriaLabel',
							"recommandations de la CNIL, voir plus d'informations à ce sujet sur le site de la CNIL, nouvelle fenêtre"
						)}
					>
						recommandations de la CNIL
					</Link>{' '}
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
						Je ne veux pas envoyer de données anonymes sur mon utilisation du
						site à des fins de mesures d'audience
					</Checkbox>
				</Body>
			</Trans>
			{valueChanged && (
				<SmallBody>
					<Trans i18nKey="privacyContent.ok">
						Vos préférences ont bien été enregistrées
					</Trans>
				</SmallBody>
			)}
			<Trans i18nKey="privacyContent.localStorageTexte">
				<Body>
					Par ailleurs, les informations renseignées lors des simulations sont
					automatiquement sauvegardées dans votre navigateur (local storage)
					afin que vous puissiez facilement les retrouver lors d'une prochaine
					visite sur le site. Si vous ne souhaitez pas que ce soit le cas, nous
					vous conseillons d'utiliser la{' '}
					<Link
						href="https://www.cnil.fr/fr/la-navigation-privee-pour-limiter-les-risques-de-piratage-de-vos-comptes-en-ligne"
						aria-label={t(
							'privacyContent.privateNavAriaLabel',
							"navigation privée, voir plus d'informations à ce sujet sur le site de la CNIL, nouvelle fenêtre"
						)}
					>
						navigation privée
					</Link>
					.
				</Body>
			</Trans>
		</PopoverWithTrigger>
	)
}
