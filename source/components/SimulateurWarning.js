import { T } from 'Components'
import { usePersistingState } from 'Components/utils/persistState'
import React from 'react'
import emoji from 'react-easy-emoji'

export default function SimulateurWarning({ simulateur }) {
	let [folded, fold] = usePersistingState(
		'app::simulateurs:warning-folded:v1:' + simulateur,
		false
	)
	return (
		<div
			id="SimulateurWarning"
			css={`
				margin-bottom: 1rem;
			`}>
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
			{!folded && (
				<div
					className="ui__ card light-bg"
					css="padding-top: 1rem; padding-bottom: 0.4rem">
					<ul>
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
								décomptes réels des Urssaf, impots.gouv.fr, ou autres.
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
					<div className="ui__ answer-group">
						<button
							className="ui__ button simple small"
							onClick={() => fold(true)}>
							<T>J'ai compris</T>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
