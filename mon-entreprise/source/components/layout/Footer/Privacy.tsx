import Overlay from 'Components/Overlay'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

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
	const { language } = useTranslation().i18n
	return (
		<>
			<Trans i18nKey="privacyContent">
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
					ci-dessous.
				</p>
			</Trans>
			<iframe
				className="ui__ card light-bg"
				css={`
					border: 0;
					padding: 1rem;
				`}
				src={`https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=${language}`}
			/>
		</>
	)
}
