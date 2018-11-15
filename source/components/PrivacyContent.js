import { T } from 'Components'
import withLanguage from 'Components/utils/withLanguage'
import React from 'react'

const PrivacyContent = ({ language }) => (
	<>
		<T k="privacyContent">
			<h1>Vie privée</h1>
			<p>
				Nous ne stockons aucune donnée personnelle sur nos serveurs. Toutes les
				informations que vous fournissez (salaires, code postal de l'entreprise,
				SIREN etc.) sont sauvegardées uniquement sur votre navigateur. Personne
				d'autre que vous ne peut y avoir accès.
			</p>
			<p>
				Toutefois, nous recueillons des statistiques anonymes sur l'utilisation
				du site, que nous utilisons dans le seul but d'améliorer le service,
				conformément aux{' '}
				<a href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience">
					recommandations de la cnil
				</a>{' '}
				et à la directive RGPD.
			</p>
			<p>Vous pouvez vous en soustraire ci-dessous.</p>
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

export default withLanguage(PrivacyContent)
