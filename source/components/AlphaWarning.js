import React from 'react'
import './AlphaWarning.css'

export default function AlphaWarning() {
	return (
		<div className="beta__container">
			<small className="beta__tag">Version alpha </small>
			<ul className="ui__ notice">
				<li>
					Tout le chiffre d'affaires part dans la rémunération du dirigeant et
					les charges (pas de bénéfice).
				</li>
				<li>
					L'impôt sur le revenu est calculé pour un célibataire sans enfants et
					sans autre revenu.
				</li>
			</ul>
		</div>
	)
}
