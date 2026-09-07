import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { SimpleField } from '@/components/Simulation/SimpleField'
import { RuleSwitchLabel, SwitchContainer } from '@/components/Switch'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { zonesLodeomDottedName } from '@/hooks/useZoneLodeom'
import {
	ajusteLaSituation,
	supprimeLaRègleDeLaSituation,
} from '@/store/actions/actions'

export default function ZoneSwitch() {
	const dispatch = useDispatch()
	const onChange = useCallback(
		(value: ValeurPublicodes | undefined) => {
			if (value === 'mayotte') {
				dispatch(
					ajusteLaSituation({
						'établissement . commune . département': 'Mayotte',
					} as Record<DottedName, ValeurPublicodes | undefined>)
				)
			} else {
				dispatch(
					supprimeLaRègleDeLaSituation('établissement . commune . département')
				)
			}
		},
		[dispatch]
	)

	return (
		<SwitchContainer>
			<SimpleField
				dottedName={zonesLodeomDottedName}
				labelStyle={RuleSwitchLabel}
				onChange={onChange}
			/>
		</SwitchContainer>
	)
}
