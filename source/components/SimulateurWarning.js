import { T } from 'Components'
import { usePersistingState } from 'Components/utils/persistState'
import withLanguage from 'Components/utils/withLanguage'
import React from 'react'
import emoji from 'react-easy-emoji'

export default withLanguage(function SimulateurWarning({ simulateur }) {
	let [folded, fold] = usePersistingState(
		'app::simulateurs:warning-folded:v1:' + simulateur,
		false
	)
	return (
		<div id="SimulateurWarning" style={{ marginBottom: '2em' }}>
			<p>
				{emoji('🚩 ')}
				<strong>
					<T k="simulateurs.warning.titre">Avant de commencer...</T>
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
						{simulateur == 'auto-entreprise' && (
							<li>
								<T k="simulateurs.warning.cfe">
									Le simulateur n'intègre pas la cotisation foncière des
									entreprise (CFE) qui est dûe dès la deuxième année d'exercice.
									Son montant varie fortement en fonction du chiffre d'affaire
									et de la domiciliation de l'entreprise.{' '}
									<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F23547">
										Plus d'infos.
									</a>
								</T>
							</li>
						)}
						<li>
							<T k="simulateurs.warning.urssaf">
								Les calculs sont indicatifs et ne se substituent pas aux
								décomptes réels des Urssaf, impots.gouv.fr, etc
							</T>
						</li>
						{simulateur == 'auto-entreprise' && (
							<li>
								<T k="simulateurs.warning.auto-entrepreneur">
									{' '}
									Les auto-entrepreneurs ne peuvent pas déduire leurs charges de
									leur chiffre d'affaires. Il faut donc retrancher au net tous
									les coûts liés à l'entreprise pour obtenir le revenu
									réellement perçu.
								</T>
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
