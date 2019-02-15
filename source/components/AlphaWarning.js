import React from 'react'
import './AlphaWarning.css'

export default function AlphaWarning() {
	return (
		<div className="beta__container">
			<small className="beta__tag">Version beta</small>
			<p>
				<strong>Ce simulateur est en cours de développement.</strong> Il ne
				saurait engager la responsabilité des organismes sociaux concernés au
				regard des déclarations et des calculs réels.{' '}
			</p>
			<p>
				Il s'agit d'une estimation purement théorique, qui se base sur les
				hypothèses suivantes :
			</p>
			<ul>
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
