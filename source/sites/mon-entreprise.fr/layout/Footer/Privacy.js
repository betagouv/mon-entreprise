import { T } from 'Components'
import Overlay from 'Components/Overlay'
import { ScrollToTop } from 'Components/utils/Scroll'
import withLanguage from 'Components/utils/withLanguage'
import React, { useState } from 'react'

export default withLanguage(function Privacy({ language }) {
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
				<T>Vie privée</T>
			</button>
			{opened && (
				<Overlay onClose={handleClose} style={{ textAlign: 'left' }}>
					<ScrollToTop />
					<PrivacyContent language={language} />
				</Overlay>
			)}
		</>
	)
})

export let PrivacyContent = ({ language }) => (
	<>
		<T k="privacyContent">
			<h1>Vie privée</h1>
			<p>
				Nous recueillons des statistiques anonymes sur l'utilisation du site,
				que nous utilisons dans le seul but d'améliorer le service, conformément
				aux{' '}
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
		</T>
		<iframe
			style={{
				border: 0,
				height: '200px',
				width: '100%'
			}}
			src={`https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=${language}`}
		/>
	</>
)
