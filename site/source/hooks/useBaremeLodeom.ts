import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { toOuiNon } from '@/domaine/engine/toOuiNon'
import { batchUpdateSituation } from '@/store/actions/actions'

const barèmesPossibles = [
	'barème compétitivité',
	'barème compétitivité renforcée',
	'barème innovation et croissance',
]

export type Barème = (typeof barèmesPossibles)[number]

type ReturnType = {
	barèmesPossibles: Barème[]
	currentBarème?: Barème
	updateBarème: (barème: Barème) => void
}

export const useBaremeLodeom = (): ReturnType => {
	const dottedName = 'salarié . cotisations . exonérations . lodeom . zone un'
	const engine = useEngine()
	const dispatch = useDispatch()

	let currentBarème
	for (let i = 0; i < barèmesPossibles.length; i++) {
		const barème = barèmesPossibles[i]
		const barèmeValue = engine.evaluate(`${dottedName} . ${barème}`).nodeValue
		if (barèmeValue) {
			currentBarème = barème
			break
		}
	}

	const updateBarème = (newBarème: Barème): void => {
		const newSituation = barèmesPossibles.reduce((situation, barème) => {
			return {
				...situation,
				[`${dottedName} . ${barème}`]: toOuiNon(barème === newBarème),
			}
		}, {})
		dispatch(batchUpdateSituation(newSituation))
	}

	return {
		barèmesPossibles,
		currentBarème,
		updateBarème,
	}
}
