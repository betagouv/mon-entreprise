/**
 * @vitest-environment jsdom
 * Sans cette directive, on ne peut pas appeler `renderHook` car Vitest tourne par
 * défaut dans un environnement Node alors que `renderHook` a besoin d'un
 * environnement DOM.
 */

import { renderHook } from '@testing-library/react'
import * as O from 'effect/Option'
import rules from 'modele-social'
import Engine from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { eurosParMois, eurosParTitreRestaurant } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	heuresParMois,
	joursOuvrés,
	pourcentage,
	titresRestaurantParMois,
} from '@/domaine/Quantité'
import { useEngine } from '@/hooks/useEngine'
import { batchUpdateSituation, updateUnit } from '@/store/actions/actions'

import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'

vi.mock('react-router-dom', () => ({
	useSearchParams: vi.fn(),
}))
const setSearchParamsMock = vi.fn()

vi.mock('react-redux', () => ({
	useDispatch: vi.fn(),
	useSelector: vi.fn(),
}))
const dispatchMock = vi.fn()

vi.mock('@/hooks/useEngine', () => ({
	useEngine: vi.fn(),
}))

describe('useSetSimulationFromSearchParams hook', () => {
	it('récupère la situation et l’unité depuis les search params', () => {
		const initialParams = new URLSearchParams({
			'salarié . contrat': 'CDD',
			'salarié . contrat . CDD . congés pris': '2.08 jours ouvrés',
			'salarié . contrat . salaire brut': '2700 €/mois',
			'salarié . rémunération . frais professionnels . titres-restaurant':
				'oui',
			'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
				'12 €/titre-restaurant',
			'salarié . rémunération . frais professionnels . titres-restaurant . nombre':
				'22 titre-restaurant/mois',
			'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
				'60%',
			'salarié . temps de travail . heures supplémentaires':
				'17.33 heures/mois',
			unité: '€/mois',
		})
		vi.mocked(useSearchParams).mockReturnValue([
			initialParams,
			setSearchParamsMock,
		])

		vi.mocked(useDispatch).mockReturnValue(dispatchMock)

		vi.mocked(useSelector).mockImplementation((selector) => {
			if (selector.name === 'configObjectifsSelector') {
				return [
					'salarié . coût total employeur',
					'salarié . contrat . salaire brut',
					'salarié . contrat . salaire brut . équivalent temps plein',
					'salarié . rémunération . net . à payer avant impôt',
					'salarié . rémunération . net . payé après impôt',
				]
			}

			return []
		})

		const engine = new Engine(rules) as Engine<DottedName>
		vi.mocked(useEngine).mockReturnValue(engine)

		renderHook(() => useSetSimulationFromSearchParams())

		expect(dispatchMock).toHaveBeenCalledWith(updateUnit('€/mois'))

		expect(dispatchMock).toHaveBeenCalledWith(
			batchUpdateSituation({
				'salarié . contrat': O.some('CDD'),
				'salarié . contrat . CDD . congés pris': O.some(joursOuvrés(2.08)),
				'salarié . contrat . salaire brut': O.some(eurosParMois(2700)),
				'salarié . rémunération . frais professionnels . titres-restaurant':
					O.some('oui'),
				'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire':
					O.some(eurosParTitreRestaurant(12)),
				'salarié . rémunération . frais professionnels . titres-restaurant . nombre':
					O.some(titresRestaurantParMois(22)),
				'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur':
					O.some(pourcentage(60)),
				'salarié . temps de travail . heures supplémentaires': O.some(
					heuresParMois(17.33)
				),
			} as Record<DottedName, O.Option<ValeurPublicodes>>)
		)

		expect(setSearchParamsMock).toHaveBeenCalledWith(new URLSearchParams(), {
			replace: true,
		})
	})

	it('ne supprime pas les search params hors situation et unité', () => {
		const initialParams = new URLSearchParams({
			'salarié . contrat': 'CDD',
			unité: '€/mois',
			utm_campaign: 'marketing',
		})
		vi.mocked(useSearchParams).mockReturnValue([
			initialParams,
			setSearchParamsMock,
		])

		vi.mocked(useDispatch).mockReturnValue(dispatchMock)

		vi.mocked(useSelector).mockImplementation(() => {
			return []
		})

		const engine = new Engine(rules) as Engine<DottedName>
		vi.mocked(useEngine).mockReturnValue(engine)

		renderHook(() => useSetSimulationFromSearchParams())

		expect(setSearchParamsMock).toHaveBeenCalledWith(
			new URLSearchParams('utm_campaign=marketing'),
			{
				replace: true,
			}
		)
	})
})
