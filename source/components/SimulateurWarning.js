import React, { useState } from 'react'
import emoji from 'react-easy-emoji'

export default function SimulateurWarning({ simulateur, autoFolded }) {
	let [userFolded, userFold] = useState(undefined)

	let folded = userFolded === undefined ? autoFolded : userFolded,
		toggle = () => userFold(!userFolded)

	return (
		<div id="SimulateurWarning" style={{ marginBottom: '2em' }}>
			<p>
				{emoji('🚩 ')}
				<strong>Outil en cours de développement </strong>
				{folded && <a onClick={toggle}> (plus d'info)</a>}
			</p>
			<div className="content">
				{!folded && (
					<ul style={{ marginLeft: '1em' }}>
						<li>réservé aux entreprises créées en 2019</li>
						{simulateur !== 'auto-entreprise' && (
							<li>
								Le chiffre d'affaires déduit des charges va à 100% dans la
								rémunération du dirigeant.
							</li>
						)}
						<li>
							l'impôt sur le revenu est calculé pour un célibataire sans enfant
							et sans autre revenu.{' '}
							{simulateur == 'auto-entreprise' && (
								<span>L'impôt libératoire n'est pas encore intégré.</span>
							)}
						</li>
						<li>
							les calculs sont indicatifs et ne se substituent pas aux décomptes
							réels des URSSAF, impots.gouv.fr, etc.
						</li>
					</ul>
				)}

				{!folded && (
					<div style={{ textAlign: 'right', paddingRight: '1em' }}>
						<a onClick={toggle}>J'ai compris</a>
					</div>
				)}
			</div>
		</div>
	)
}
