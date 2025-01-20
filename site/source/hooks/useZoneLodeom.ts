import { DottedName } from 'modele-social'

import { useEngine } from '@/components/utils/EngineContext'

const zones = ['zone un', 'zone deux']

export type ZoneLodeom = (typeof zones)[number]

export const zonesLodeomDottedName =
	'salarié . cotisations . exonérations . zones lodeom' as DottedName

export const useZoneLodeom = (): ZoneLodeom | undefined => {
	const engine = useEngine()

	return engine.evaluate(zonesLodeomDottedName).nodeValue as ZoneLodeom
}
