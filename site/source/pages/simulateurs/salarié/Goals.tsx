import { useState } from 'react'

import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'

import Aides from './components/Aides'
import TitresRestaurant from './components/TitresRestaurant'

export default function SalariéSimulationGoals() {
	const [avecCentimes, setAvecCentimes] = useState(false)

	const handleUpdateSituation = (
		_name: DottedName,
		value?: ValeurPublicodes
	) => {
		if (
			value &&
			typeof value === 'object' &&
			'valeur' in value &&
			typeof value.valeur === 'number' &&
			!Number.isInteger(value.valeur)
		) {
			setAvecCentimes(true)
		}
	}

	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal
				dottedName="salarié . coût total employeur"
				round={!avecCentimes}
				onUpdateSituation={handleUpdateSituation}
			/>
			<Aides />

			<SimulationGoal
				dottedName="salarié . contrat . salaire brut"
				round={!avecCentimes}
				onUpdateSituation={handleUpdateSituation}
			/>
			<SimulationGoal
				small
				dottedName="salarié . contrat . salaire brut . équivalent temps plein"
				round={!avecCentimes}
				onUpdateSituation={handleUpdateSituation}
			/>
			<SimulationGoal
				dottedName="salarié . rémunération . net . à payer avant impôt"
				round={!avecCentimes}
				onUpdateSituation={handleUpdateSituation}
			/>
			<TitresRestaurant />
			<SimulationGoal
				dottedName="salarié . rémunération . net . payé après impôt"
				round={!avecCentimes}
				onUpdateSituation={handleUpdateSituation}
			/>
		</SimulationGoals>
	)
}