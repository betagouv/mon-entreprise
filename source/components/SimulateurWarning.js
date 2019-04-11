import { T } from 'Components'
import usePersistingState from 'Components/utils/usePersistingState'
import withLanguage from 'Components/utils/withLanguage'
import React from 'react'
import emoji from 'react-easy-emoji'

export default withLanguage(function SimulateurWarning({
	simulateur,
	language
}) {
	let [folded, fold] = usePersistingState(
		'app::simulateurs:warning-folded',
		false
	)
	return (
		<div id="SimulateurWarning" style={{ marginBottom: '2em' }}>
			<p>
				{emoji('🚩 ')}
				<strong>
					<T k="simulateurs.warning.titre">Outil en cours de développement </T>
				</strong>{' '}
				{folded && (
					<button
						className="ui__ button simple small"
						onClick={() => fold(false)}>
						<T k="simulateurs.warning.plus">(plus d'info)</T>
					</button>
				)}
			</p>
			<div className={`content ${folded ? '' : 'ui__ card'}`}>
				{!folded && (
					<ul style={{ marginLeft: '1em' }}>
						{simulateur !== 'auto-entreprise' && (
							<li>
								<T k="simulateurs.warning.line1">
									le chiffre d'affaires déduit des charges va à 100% dans la
									rémunération du dirigeant
								</T>
							</li>
						)}
						<li>
							<T k="simulateurs.warning.line2">
								l'impôt sur le revenu est calculé pour un célibataire sans
								enfant et sans autre revenu.
							</T>{' '}
							{simulateur == 'auto-entreprise' && language === 'fr' && (
								<span>L'impôt libératoire n'est pas encore intégré.</span>
							)}
						</li>
						<li>
							<T k="simulateurs.warning.line3">
								les calculs sont indicatifs et ne se substituent pas aux
								décomptes réels des Urssaf, impots.gouv.fr, etc
							</T>
						</li>
					</ul>
				)}

				{!folded && (
					<div style={{ textAlign: 'right', paddingRight: '1em' }}>
						<button
							className="ui__ button simple small"
							onClick={() => fold(true)}>
							<T>J'ai compris</T>
						</button>
					</div>
				)}
			</div>
		</div>
	)
})
