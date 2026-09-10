import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'

export type PériodeDeCalcul = '€/mois' | '€/an'

const isPériodeDeCalcul = (value?: unknown): value is PériodeDeCalcul =>
	typeof value === 'string' && (value === '€/mois' || value === '€/an')

type Props = {
	unité: PériodeDeCalcul
	onChange: (unité: PériodeDeCalcul) => void
}

export const ChoixPériodeDeCalcul = ({ unité, onChange }: Props) => {
	const handleChange = useCallback(
		(value: Key) => {
			if (!isPériodeDeCalcul(value)) {
				return
			}
			onChange(value)
		},
		[onChange]
	)

	const { t } = useTranslation()

	return (
		<SimulationGoalRadio
			titre={t(
				'pages.simulateurs.commun.periode-calcul.titre',
				'Période de calcul'
			)}
			value={unité}
			options={[
				{
					key: '€/mois',
					value: '€/mois',
					label: t(
						'pages.simulateurs.commun.periode-calcul.mensuelle',
						'Montant mensuel'
					),
				},
				{
					key: '€/an',
					value: '€/an',
					label: t(
						'pages.simulateurs.commun.periode-calcul.annuelle',
						'Montant annuel'
					),
				},
			]}
			onChange={handleChange}
		/>
	)
}
