import { initialSituationCMG, SituationCMG } from '../domaine/situation'
import { useSituationContext } from './CMGContext'

export const useCMG = () => {
	const { situation, updateSituation } = useSituationContext()

	const set = {
		situation: (situation: SituationCMG) => {
			updateSituation(() => situation)
		},

		reset: () => {
			updateSituation(() => initialSituationCMG)
		},
	}

	return {
		situation,
		set,
	}
}
