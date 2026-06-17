import { Option } from 'effect'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { SimpleField } from '@/components/Simulation/SimpleField'
import { H3 } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { getNotification } from '@/domaine/publicodes/Notification'
import { useDate } from '@/hooks/useDate'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const DateCessationQuestion = () => {
	const dispatch = useDispatch()
	const engine = useEngine()
	const dateEngine = useDate()
	const radiéeCetteAnnée = PublicodesAdapter.decode(
		engine.evaluate('entreprise . radiée cette année')
	)
	const notificationDateInvalide = getNotification(
		engine,
		'entreprise . date de cessation . invalide'
	)

	useEffect(() => {
		if (Option.isSome(radiéeCetteAnnée) && radiéeCetteAnnée.value === 'non') {
			const date =
				engine.evaluate({
					valeur: "période . fin d'année",
					contexte: {
						date: 'entreprise . date de cessation',
					},
				}).nodeValue ?? undefined
			if (date !== dateEngine) {
				dispatch(
					ajusteLaSituation({
						date,
					} as Record<DottedName, ValeurPublicodes | undefined>)
				)
			}
		}
	}, [dateEngine, dispatch, engine, radiéeCetteAnnée])

	return (
		<SimpleField
			dottedName="entreprise . date de cessation"
			labelStyle={H3}
			errorMessage={notificationDateInvalide?.description}
		/>
	)
}
