import { T } from 'Components'
import React from 'react'
import InfoBulle from 'Ui/InfoBulle'

export default function ResultReliability({ progress, noProgressMessage }) {
	return (
		<span>
			<small>
				{!noProgressMessage && progress === 0 && (
					<T k="simulateurs.précision.défaut">
						Affinez la simulation en répondant aux questions suivantes :
					</T>
				)}
			</small>
			{progress > 0 && (
				<>
					<small>
						{progress < 0.2 ? (
							<T k="simulateurs.précision.faible">Précision faible</T>
						) : progress < 0.5 ? (
							<T k="simulateurs.précision.moyenne">Précision moyenne</T>
						) : progress > 0.5 ? (
							<T k="simulateurs.précision.bonne">Bonne précision</T>
						) : (
							''
						)}
					</small>{' '}
					<InfoBulle>
						Le résultat peut varier énormément en fonction de votre situation.
						Répondez aux questions pour en améliorer la précision.
					</InfoBulle>{' '}
				</>
			)}
		</span>
	)
}
