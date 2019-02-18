import { T } from 'Components'
import React from 'react'
import emoji from 'react-easy-emoji'
import './SimulateurWarning.css'

export default function SimulateurWarning() {
	return (
		<>
			<p>
				{emoji('🚩')}{' '}
				<T k="simulationWarning">
					Ce simulateur donne une estimation sur des données{' '}
					<strong>purement théoriques</strong> de chiffre d'affaires, de charges
					et de base fiscale célibataire sans enfant hors tout autre revenu{' '}
					<strong>
						qui ne saurait engager la responsabilité des organismes sociaux
						concernés au regard des déclarations et des calculs réels.
					</strong>
				</T>
			</p>
			<div className="beta__container">
				<small className="beta__tag">Version beta</small>
				<p>
					<strong>Ce simulateur est en cours de développement.</strong> Les
					calculs sont effectués sur la base des hypothèses suivantes :
				</p>
				<ul>
					<li>
						Tout le chiffre d'affaires part dans la rémunération du dirigeant et
						les charges (pas de bénéfice).
					</li>
					<li>
						L'impôt sur le revenu est calculé pour un célibataire sans enfants
						et sans autre revenu.
					</li>
				</ul>
			</div>
		</>
	)
}
