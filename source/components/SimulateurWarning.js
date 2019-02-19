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
					<ul>
						<li>
							Le chiffre d'affaires déduit des charges va à 100% dans la
							rémunération du dirigeant.
						</li>
						<li>
							Le calcul de l'impôt sur le revenu, est basé sur un célibataire
							sans enfant sans autre revenu.{' '}
						</li>
						<li>
							Ce simulateur donne une estimation purement indicative des
							cotisations
						</li>
					</ul>
				</T>
			</p>
			<div className="beta__container">
				<small className="beta__tag">Version beta</small>
				<p>
					<strong>Ce simulateur est en cours de développement.</strong>
				</p>
			</div>
		</>
	)
}
