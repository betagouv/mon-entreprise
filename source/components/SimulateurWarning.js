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
					<T k="simulateurs.warning.titre">A lire avant de commencer...</T>
				</strong>{' '}
				{folded && (
					<button
						className="ui__ button simple small"
						onClick={() => fold(false)}>
						<T k="simulateurs.warning.plus">Lire les précisions</T>
					</button>
				)}
			</p>
			<div className={`content ${folded ? '' : 'ui__ card'}`}>
				{!folded && (
					<ul style={{ marginLeft: '1em' }}>
						<li>
							<T k="simulateurs.warning.line2">
								L'impôt sur le revenu est calculé pour un célibataire sans
								enfant et sans autre revenu.
							</T>{' '}
							{simulateur == 'auto-entreprise' && language === 'fr' && (
								<span>L'impôt libératoire n'est pas encore intégré.</span>
							)}
						</li>
						<li>
							<T k="simulateurs.warning.line3">
								Les calculs sont indicatifs et ne se substituent pas aux
								décomptes réels des Urssaf, impots.gouv.fr, etc
							</T>
						</li>
						{simulateur == 'auto-entreprise' && language === 'fr' && (
							<li>
								<strong>Attention : </strong> Les auto-entrepreneur ne peuvent
								pas déduire leur charge de leur chiffre d'affaires. Il faut donc
								retrancher au net tous les coûts liés à l'entreprise pour
								obtenir le revenu réellement perçu.
							</li>
						)}
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
