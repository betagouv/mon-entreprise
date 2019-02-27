import { T } from 'Components'
import React from 'react'
import emoji from 'react-easy-emoji'
import './SimulateurWarning.css'

export default function SimulateurWarning({ simulateur }) {
	return (
		<div id="SimulateurWarning">
			<p>
				{emoji('🚩 ')}
				<strong>Ce simulateur est en cours de développement</strong>
			</p>
			<ul>
				<li>Simulation pour une entreprise créée en 2019</li>
				{simulateur !== 'auto-entreprise' && (
					<li>
						Le chiffre d'affaires déduit des charges va à 100% dans la
						rémunération du dirigeant.
					</li>
				)}
				<li>
					L'impôt sur le revenu est calculé pour un célibataire sans enfant et
					sans autre revenu.{' '}
					{simulateur == 'auto-entreprise' && (
						<span>L'impôt libératoire n'est pas encore intégré.</span>
					)}
				</li>
				<li>
					Les calculs sont indicatifs et ne se substituent pas aux décomptes
					réels : URSSAF, impots.gouv.fr, etc.
				</li>
			</ul>
		</div>
	)
}
