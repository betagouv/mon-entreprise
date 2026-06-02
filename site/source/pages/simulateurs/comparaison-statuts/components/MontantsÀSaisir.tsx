import { useTranslation } from 'react-i18next'

import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal } from '@/components/Simulation'

export const MontantsÀSaisir = () => {
	const { t } = useTranslation()

	return (
		<>
			<PeriodSwitch />
			<SimulationGoal
				dottedName="entreprise . chiffre d'affaires"
				isInfoMode
				label={t(
					'pages.simulateurs.comparaison-statuts.montants.CA',
					'Chiffre d’affaires estimé'
				)}
			/>
			<SimulationGoal dottedName="entreprise . charges" isInfoMode />
		</>
	)
}
