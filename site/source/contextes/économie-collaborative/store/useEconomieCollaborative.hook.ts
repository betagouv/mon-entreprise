import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SituationÉconomieCollaborative } from '@/contextes/économie-collaborative/domaine/location-de-meublé'
import {
	isSituationÉconomieCollaborative,
	SITUATION_ÉCONOMIE_COLLABORATIVE,
} from '@/contextes/économie-collaborative/domaine/location-de-meublé/situation'
import {
	économieCollaborativeReducer,
	économieCollaborativeSlice,
} from '@/contextes/économie-collaborative/store/slice'
import {
	registerSituationReducer,
	selectSituation,
} from '@/store/slices/simulateursSlice'

export const useEconomieCollaborative = () => {
	const situation = useSelector(selectSituation)
	const dispatch = useDispatch()

	registerSituationReducer(
		SITUATION_ÉCONOMIE_COLLABORATIVE,
		économieCollaborativeReducer
	)

	useEffect(() => {
		if (!situation || !isSituationÉconomieCollaborative(situation)) {
			dispatch(économieCollaborativeSlice.actions.reset())
		}
	}, [situation, dispatch])

	if (!situation || !isSituationÉconomieCollaborative(situation)) {
		return {
			ready: false,
		} as const
	}

	const setSituation = (situation: SituationÉconomieCollaborative) =>
		dispatch(économieCollaborativeSlice.actions.setSituation(situation))

	return {
		ready: true,
		situation,
		setSituation,
	} as const
}
