/**
 * @vitest-environment jsdom
 * Sans cette directive, on ne peut pas appeler `renderHook` car Vitest tourne par
 * défaut dans un environnement Node alors que `renderHook` a besoin d'un
 * environnement DOM.
 */

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import SalariéSimulation from '@/pages/simulateurs/salarié/Salarié'

import { useCurrentSimulatorData } from './useCurrentSimulatorData'
import { useSearchParamsForSituation } from './useSearchParamsForSituation'
import { useSiteUrl } from './useSiteUrl'
import { useUrl } from './useUrl'

vi.mock('@/hooks/useSiteUrl', () => ({
	useSiteUrl: vi.fn(),
}))
vi.mock('@/hooks/useCurrentSimulatorData', () => ({
	useCurrentSimulatorData: vi.fn(),
}))
vi.mock('@/hooks/useSearchParamsForSituation', () => ({
	useSearchParamsForSituation: vi.fn(),
}))
vi.mock('@/pages/simulateurs/salarié/Salarié', () => ({
	default: () => null,
}))

describe('useUrl hook', () => {
	it('retourne l’URL avec le chemin du simulateur actuel et les paramètres de la situation actuelle lorsqu’il est appelé sans paramètres', () => {
		vi.mocked(useSiteUrl).mockReturnValue('https://mon-entreprise.urssaf.fr')

		vi.mocked(useCurrentSimulatorData).mockReturnValue({
			key: 'salarié',
			currentSimulatorData: {
				id: 'salarié',
				tracking: 'salarié',
				icône: '🤝',
				title: 'Simulateur salarié',
				iframePath: 'simulateur-embauche',
				meta: {
					title: 'meta title',
					description: 'meta description',
				},
				pathId: 'simulateurs.salarié',
				shortName: 'salarié',
				path: '/simulateurs/salaire-brut-net',
				component: vi.mocked(SalariéSimulation),
			},
		})
		vi.mocked(useSearchParamsForSituation).mockReturnValue(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)

		const { result } = renderHook(() => useUrl())

		expect(useSearchParamsForSituation).toHaveBeenCalledWith(undefined)

		expect(result.current).toEqual(
			'https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net?salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})

	it('retourne l’URL avec le chemin donné et les paramètres de la situation actuelle lorsqu’il est appelé avec le paramètre `path`', () => {
		vi.mocked(useSiteUrl).mockReturnValue('https://mon-entreprise.urssaf.fr')

		vi.mocked(useCurrentSimulatorData).mockReturnValue({
			key: 'salarié',
			currentSimulatorData: {
				id: 'salarié',
				tracking: 'salarié',
				icône: '🤝',
				title: 'Simulateur salarié',
				iframePath: 'simulateur-embauche',
				meta: {
					title: 'meta title',
					description: 'meta description',
				},
				pathId: 'simulateurs.salarié',
				shortName: 'salarié',
				path: '/simulateurs/salaire-brut-net',
				component: vi.mocked(SalariéSimulation),
			},
		})
		vi.mocked(useSearchParamsForSituation).mockReturnValue(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)

		const { result } = renderHook(() =>
			useUrl({
				path: '/simulateurs/auto-entrepreneur',
			})
		)

		expect(useSearchParamsForSituation).toHaveBeenCalledWith(undefined)

		expect(result.current).toEqual(
			'https://mon-entreprise.urssaf.fr/simulateurs/auto-entrepreneur?salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})

	it('retourne l’URL avec le chemin du simulateur actuel et les paramètres de la situation donnée lorsqu’il est appelé avec le paramètre `situation`', () => {
		vi.mocked(useSiteUrl).mockReturnValue('https://mon-entreprise.urssaf.fr')

		vi.mocked(useCurrentSimulatorData).mockReturnValue({
			key: 'salarié',
			currentSimulatorData: {
				id: 'salarié',
				tracking: 'salarié',
				icône: '🤝',
				title: 'Simulateur salarié',
				iframePath: 'simulateur-embauche',
				meta: {
					title: 'meta title',
					description: 'meta description',
				},
				pathId: 'simulateurs.salarié',
				shortName: 'salarié',
				path: '/simulateurs/salaire-brut-net',
				component: vi.mocked(SalariéSimulation),
			},
		})
		vi.mocked(useSearchParamsForSituation).mockReturnValue(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)

		const { result } = renderHook(() =>
			useUrl({
				situation: {
					'salarié . contrat': 'CDD',
				},
			})
		)

		expect(useSearchParamsForSituation).toHaveBeenCalledWith({
			'salarié . contrat': 'CDD',
		})

		expect(result.current).toEqual(
			'https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net?salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})

	it('retourne l’URL avec le chemin donné et les paramètres de la situation donnée lorsqu’il est appelé avec les paramètres `path` et `situation`', () => {
		vi.mocked(useSiteUrl).mockReturnValue('https://mon-entreprise.urssaf.fr')

		vi.mocked(useCurrentSimulatorData).mockReturnValue({
			key: 'salarié',
			currentSimulatorData: {
				id: 'salarié',
				tracking: 'salarié',
				icône: '🤝',
				title: 'Simulateur salarié',
				iframePath: 'simulateur-embauche',
				meta: {
					title: 'meta title',
					description: 'meta description',
				},
				pathId: 'simulateurs.salarié',
				shortName: 'salarié',
				path: '/simulateurs/salaire-brut-net',
				component: vi.mocked(SalariéSimulation),
			},
		})
		vi.mocked(useSearchParamsForSituation).mockReturnValue(
			'salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)

		const { result } = renderHook(() =>
			useUrl({
				path: '/simulateurs/auto-entrepreneur',
				situation: {
					'salarié . contrat': 'CDD',
				},
			})
		)

		expect(useSearchParamsForSituation).toHaveBeenCalledWith({
			'salarié . contrat': 'CDD',
		})

		expect(result.current).toEqual(
			'https://mon-entreprise.urssaf.fr/simulateurs/auto-entrepreneur?salari%C3%A9+.+contrat=CDD&unit%C3%A9=%E2%82%AC%2Fmois'
		)
	})
})
