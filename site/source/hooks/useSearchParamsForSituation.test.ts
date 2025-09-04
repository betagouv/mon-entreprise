/**
 * @vitest-environment jsdom
 * Sans cette directive, on ne peut pas appeler `renderHook` car Vitest tourne par
 * défaut dans un environnement Node alors que `renderHook` a besoin d'un
 * environnement DOM.
 */

import { renderHook } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'

import { getSearchParamsFromSituation } from '@/domaine/searchParams'

import { useSearchParamsForSituation } from './useSearchParamsForSituation'

vi.mock('react-redux', () => ({
	useSelector: vi.fn(),
}))
vi.mock('@/domaine/searchParams', () => ({
	getSearchParamsFromSituation: vi.fn(),
}))

describe('useSearchParamsForSituation hook', () => {
	it('retourne les search params de la situation actuelle lorsqu’il est appelé sans paramètres', () => {
		vi.mocked(useSelector).mockImplementation((selector) => {
			if (selector.name === 'situationSelector') {
				return {
					'salarié . contrat': 'CDD',
				}
			}

			if (selector.name === 'targetUnitSelector') {
				return '€/mois'
			}

			return {}
		})

		vi.mocked(getSearchParamsFromSituation).mockReturnValue(
			new URLSearchParams({
				'salarié . contrat': 'CDD',
				unité: '€/mois',
			})
		)

		const { result } = renderHook(() => useSearchParamsForSituation())

		expect(getSearchParamsFromSituation).toHaveBeenCalledWith(
			{
				'salarié . contrat': 'CDD',
			},
			'€/mois'
		)

		expect(result.current).toEqual(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})

	it('retourne les search params de la situation actuelle lorsqu’il est appelé avec une situation', () => {
		vi.mocked(useSelector).mockImplementation((selector) => {
			if (selector.name === 'situationSelector') {
				return {
					'salarié . contrat': 'CDI',
				}
			}

			if (selector.name === 'targetUnitSelector') {
				return '€/mois'
			}

			return {}
		})

		vi.mocked(getSearchParamsFromSituation).mockReturnValue(
			new URLSearchParams({
				'salarié . contrat': 'CDD',
				unité: '€/mois',
			})
		)

		const { result } = renderHook(() =>
			useSearchParamsForSituation({
				'salarié . contrat': 'CDD',
			})
		)

		expect(getSearchParamsFromSituation).toHaveBeenCalledWith(
			{
				'salarié . contrat': 'CDD',
			},
			'€/mois'
		)

		expect(result.current).toEqual(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})
})
