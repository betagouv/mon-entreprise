import possiblesDestinataires from 'Images/destinataires/destinataires.yaml'
import React from 'react'
import { Trans } from 'react-i18next'
import './Destinataire.css'

export default function Rule({ destinataire }: { destinataire: string }) {
	let destinataireData = possiblesDestinataires[destinataire]

	return destinataire && destinataireData ? (
		<div className="infobox__item" id="destinataire">
			<h4>
				<Trans>Destinataire</Trans>
				&nbsp;:
			</h4>
			<div>
				<a href={destinataireData.lien} target="_blank">
					{destinataireData.image && (
						<img
							src={require('Images/destinataires/' + destinataireData.image)}
						/>
					)}
					{!destinataireData.image && (
						<div id="calligraphy">{destinataire}</div>
					)}
				</a>
				{destinataireData.nom && (
					<div id="destinataireName">{destinataireData.nom}</div>
				)}
			</div>
		</div>
	) : null
}
