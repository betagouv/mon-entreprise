import { Key, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import {
	isUnitéMonétaireRécurrente,
	UnitéMonétaireRécurrente,
} from '@/domaine/Unites'

type Props = {
	unité: UnitéMonétaireRécurrente
	onChange: (unité: UnitéMonétaireRécurrente) => void
}

export const ChoixPériodeDeCalcul = ({ unité, onChange }: Props) => {
	const handleChange = useCallback(
		(value: Key) => {
			if (typeof value !== 'string' || !isUnitéMonétaireRécurrente(value)) {
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
