import React from 'react'
import possiblesDestinataires from 'Règles/ressources/destinataires/destinataires.yaml'

export default ({ destinataire }) =>
	do {
		let destinataireData = possiblesDestinataires[destinataire]
		destinataire ? (
			<div id="destinataire">
				<h3>Destinataire</h3>
				{!destinataireData ? (
					<p>Non renseigné</p>
				) : (
					<div>
						<a href={destinataireData.lien} target="_blank">
							{destinataireData.image && (
								<img
									src={require('Règles/ressources/destinataires/' +
										destinataireData.image)}
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
				)}
			</div>
		) : null
	}
