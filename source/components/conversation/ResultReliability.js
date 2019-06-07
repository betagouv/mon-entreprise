import React from 'react'
import InfoBulle from 'Ui/InfoBulle'

export default function ResultReliability({ progress }) {
	return (
		<span>
			<small>
				Précision du résultat :{' '}
				<strong>
					{progress === 0
						? 'Mauvaise'
						: progress < 0.2
						? 'Faible'
						: progress < 0.5
						? 'Moyenne'
						: progress < 0.7
						? 'Bonne'
						: progress < 0.8
						? 'Très bonne'
						: progress < 1
						? 'Excellente'
						: 'Optimale'}
				</strong>
			</small>{' '}
			<InfoBulle>
				Le résultat peut varier énormément en fonction de votre situation.
				Répondez aux questions pour en améliorer la précision.
			</InfoBulle>{' '}
		</span>
	)
}
