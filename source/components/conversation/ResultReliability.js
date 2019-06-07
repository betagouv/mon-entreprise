import React from 'react'
import InfoBulle from 'Ui/InfoBulle'

export default function ResultReliability({ progress }) {
	return (
		<span>
			<small>
				{progress === 0 && (
					<span>
						Affinez la simulation en répondant aux questions suivantes :
					</span>
				)}
			</small>
			{progress > 0 && (
				<>
					<small>
						{progress < 0.2
							? 'Précision faible'
							: progress < 0.5
							? 'Précision moyenne'
							: progress > 0.5
							? 'Bonne précision'
							: ''}
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
