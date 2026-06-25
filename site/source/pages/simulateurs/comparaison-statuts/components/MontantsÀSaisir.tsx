import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal } from '@/components/Simulation'

import { ChoixImposition } from './ChoixImposition'
import { ChoixVersementLibératoire } from './ChoixVersementLibératoire'

export const MontantsÀSaisir = () => {
	const { t } = useTranslation()

	return (
		<Conteneur>
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

			<ChoixImposition />

			<ChoixVersementLibératoire />
		</Conteneur>
	)
}

const Conteneur = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: ${({ theme }) => theme.spacings.xl};
`
