import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { useZoneLodeom, ZoneLodeom } from './useZoneLodeom'

const barèmes = [
	'compétitivité',
	'compétitivité renforcée',
	'innovation et croissance',
	'moins de 11 salariés',
	'sectoriel',
	'renforcé',
]

export type BarèmeLodeom = (typeof barèmes)[number]

export const barèmeLodeomDottedName = (zone: ZoneLodeom) =>
	`salarié . cotisations . exonérations . lodeom . ${zone} . barèmes` as DottedName

export const useBarèmeLodeom = (): BarèmeLodeom | undefined => {
	const zone = useZoneLodeom()
	const engine = useEngine()

	return (
		zone &&
		(engine.evaluate(barèmeLodeomDottedName(zone)).nodeValue as BarèmeLodeom)
	)
}
