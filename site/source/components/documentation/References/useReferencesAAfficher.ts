import { useIsEmbeddedOnBPISite } from '@/hooks/useIsEmbeddedOnBPISite'

import { Références, référencesÀAfficher } from './references'

export function useRéférencesÀAfficher(références?: Références): Références {
	const embarquéSurLeSiteBPI = useIsEmbeddedOnBPISite()

	return référencesÀAfficher(références, embarquéSurLeSiteBPI)
}
