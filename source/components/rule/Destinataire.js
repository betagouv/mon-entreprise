import React, { Component } from 'react'
import possiblesDestinataires from 'Règles/ressources/destinataires/destinataires.yaml'
import './Destinataire.css'

export default class Rule extends Component {
	render() {
		let { destinataire } = this.props,
			destinataireData = possiblesDestinataires[destinataire]

		return destinataire && destinataireData ? (
			<div className="infobox__item" id="destinataire">
				<h4>Destinaire&nbsp;:</h4>
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
			</div>
		) : null
	}
}
