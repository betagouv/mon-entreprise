import { DottedName } from 'modele-social'
import { useDispatch } from 'react-redux'

import { useEngine } from '@/components/utils/EngineContext'
import { toOuiNon } from '@/domaine/engine/toOuiNon'
import {
	batchUpdateSituation,
	deleteFromSituation,
} from '@/store/actions/actions'

import { useZoneLodeom, ZoneLodeom as Zone } from './useZoneLodeom'

const barèmes = {
	['zone un' as Zone]: [
		'barème compétitivité',
		'barème compétitivité renforcée',
		'barème innovation et croissance',
	],
	['zone deux' as Zone]: [
		'barème moins de 11 salariés',
		'barème sectoriel',
		'barème compétitivité',
	],
}

export type Barème = (typeof barèmes)[Zone][number]

type ReturnType = {
	barèmes: Barème[]
	currentBarème?: Barème
	updateBarème: (barème?: Barème) => void
}

export const useBarèmeLodeom = (): ReturnType => {
	const dottedName = 'salarié . cotisations . exonérations . lodeom'
	const { currentZone } = useZoneLodeom()
	const engine = useEngine()
	const dispatch = useDispatch()

	const barèmesPossibles = currentZone ? barèmes[currentZone] : []

	const currentBarème = barèmesPossibles.find((barème) => {
		const barèmeValue = engine.evaluate(
			`${dottedName} . ${currentZone} . ${barème}`
		).nodeValue

		return !!barèmeValue
	})

	const updateBarème = (newBarème?: Barème): void => {
		if (!newBarème) {
			barèmesPossibles.forEach((barème) => {
				dispatch(
					deleteFromSituation(
						`${dottedName} . ${currentZone} . ${barème}` as DottedName
					)
				)
			})
		} else {
			const newSituation = barèmesPossibles.reduce((situation, barème) => {
				return {
					...situation,
					[`${dottedName} . ${currentZone} . ${barème}`]: toOuiNon(
						barème === newBarème
					),
				}
			}, {})
			dispatch(batchUpdateSituation(newSituation))
		}
	}

	return {
		barèmes: barèmesPossibles,
		currentBarème,
		updateBarème,
	}
}
