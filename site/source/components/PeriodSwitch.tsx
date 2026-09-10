import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
	ChoixPériodeDeCalcul,
	isPériodeDeCalcul,
	PériodeDeCalcul,
} from '@/components/Simulateur/ChoixPeriodeDeCalcul'
import { updateUnit } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

export default function PeriodSwitch() {
	const dispatch = useDispatch()

	const currentUnit = useSelector(targetUnitSelector)
	const unité = isPériodeDeCalcul(currentUnit) ? currentUnit : '€/an'

	const onChange = useCallback(
		(unité: PériodeDeCalcul) => {
			dispatch(updateUnit(unité))
		},
		[dispatch]
	)

	return <ChoixPériodeDeCalcul unité={unité} onChange={onChange} />
}
