import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { toOuiNon } from '@/domaine/engine/toOuiNon'
import { batchUpdateSituation } from '@/store/actions/actions'

const zones = ['zone un', 'zone deux']

export type ZoneLodeom = (typeof zones)[number]

type ReturnType = {
	currentZone?: ZoneLodeom
	updateZone: (zone: ZoneLodeom) => void
}

export const useZoneLodeom = (): ReturnType => {
	const engine = useEngine()
	const dispatch = useDispatch()
	const dottedName = 'salarié . cotisations . exonérations . lodeom'

	const currentZone = zones.find((zone) => {
		const zoneValue = engine.evaluate(`${dottedName} . ${zone}`).nodeValue

		return !!zoneValue
	})

	const updateZone = (newZone: ZoneLodeom): void => {
		const newSituation = zones.reduce((situation, zone) => {
			return {
				...situation,
				[`${dottedName} . ${zone}`]: toOuiNon(zone === newZone),
			}
		}, {})
		dispatch(batchUpdateSituation(newSituation))
	}

	return { currentZone, updateZone }
}
