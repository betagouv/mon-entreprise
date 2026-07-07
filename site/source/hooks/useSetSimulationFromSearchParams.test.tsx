import { renderHook } from '@testing-library/react'
import * as O from 'effect/Option'
import rules from 'modele-social'
import Engine from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'

import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { eurosParMois, eurosParTitreRestaurant } from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	heuresParMois,
	joursOuvrés,
	pourcentage,
	titresRestaurantParMois,
} from '@/domaine/Quantite'
import { useNavigation } from '@/lib/navigation/index'
import {
	enregistreLesRéponsesAuxQuestions,
	updateUnit,
} from '@/store/actions/actions'

import { useEngineFromModèle } from './useEngineFromModele'
import useSetSimulationFromSearchParams from './useSetSimulationFromSearchParams'

vi.mock('@/lib/navigation', () => ({
	useNavigation: vi.fn(),
}))
const setSearchParamsMock = vi.fn()

vi.mock('react-redux', () => ({
	useDispatch: vi.fn(),
	useSelector: vi.fn(),
}))
const dispatchMock = vi.fn()

vi.mock('@/hooks/useEngineFromModèle', () => ({
	useEngineFromModèle: vi.fn(),
}))

describe('useSetSimulationFromSearchParams hook', () => {
	it('récupère la situation et l’unité depuis les search params', () => {
		const initialParams = new URLSearchParams({
			'salarie . contrat': 'CDD',
			'salarie . contrat . CDD . congés pris': '2.08 jours ouvrés',
			'salarie . contrat . salaire brut': '2700 €/mois',
			'salarie . rémunération . frais professionnels . titres-restaurant':
				'oui',
			'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire':
				'12 €/titre-restaurant',
			'salarie . rémunération . frais professionnels . titres-restaurant . nombre':
				'22 titre-restaurant/mois',
			'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur':
				'60%',
			'salarie . temps de travail . heures supplémentaires':
				'17.33 heures/mois',
			unité: '€/mois',
		})
		vi.mocked(useNavigation).mockReturnValue({
			Link: () => null,
			searchParams: initialParams,
			setSearchParams: setSearchParamsMock,
			navigate: vi.fn(),
			currentPath: '/',
			locationHash: '',
			navigationType: 'PUSH',
			getHref: vi.fn((to: string) => to),
			onNavigate: vi.fn(() => () => {}),
			matchPath: vi.fn(() => null),
			generatePath: vi.fn((pattern: string) => pattern),
		})

		vi.mocked(useDispatch).mockReturnValue(dispatchMock)

		vi.mocked(useSelector).mockImplementation((selector) => {
			if (selector.name === 'configObjectifsSelector') {
				return [
					'salarie . coût total employeur',
					'salarie . contrat . salaire brut',
					'salarie . contrat . salaire brut . équivalent temps plein',
					'salarie . rémunération . net . à payer avant impôt',
					'salarie . rémunération . net . payé après impôt',
				]
			}

			return []
		})

		const engine = new Engine(rules) as Engine<DottedName>
		vi.mocked(useEngineFromModèle).mockReturnValue(engine)

		renderHook(() => useSetSimulationFromSearchParams('modele-social'))

		expect(dispatchMock).toHaveBeenCalledWith(updateUnit('€/mois'))

		expect(dispatchMock).toHaveBeenCalledWith(
			enregistreLesRéponsesAuxQuestions({
				'salarie . contrat': O.some('CDD'),
				'salarie . contrat . CDD . congés pris': O.some(joursOuvrés(2.08)),
				'salarie . contrat . salaire brut': O.some(eurosParMois(2700)),
				'salarie . rémunération . frais professionnels . titres-restaurant':
					O.some('oui'),
				'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire':
					O.some(eurosParTitreRestaurant(12)),
				'salarie . rémunération . frais professionnels . titres-restaurant . nombre':
					O.some(titresRestaurantParMois(22)),
				'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur':
					O.some(pourcentage(60)),
				'salarie . temps de travail . heures supplémentaires': O.some(
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
			'salarie . contrat': 'CDD',
			unité: '€/mois',
			utm_campaign: 'marketing',
		})
		vi.mocked(useNavigation).mockReturnValue({
			Link: () => null,
			searchParams: initialParams,
			setSearchParams: setSearchParamsMock,
			navigate: vi.fn(),
			currentPath: '/',
			locationHash: '',
			navigationType: 'PUSH',
			getHref: vi.fn((to: string) => to),
			onNavigate: vi.fn(() => () => {}),
			matchPath: vi.fn(() => null),
			generatePath: vi.fn((pattern: string) => pattern),
		})

		vi.mocked(useDispatch).mockReturnValue(dispatchMock)

		vi.mocked(useSelector).mockImplementation(() => {
			return []
		})

		const engine = new Engine(rules) as Engine<DottedName>
		vi.mocked(useEngineFromModèle).mockReturnValue(engine)

		renderHook(() => useSetSimulationFromSearchParams('modele-social'))

		expect(setSearchParamsMock).toHaveBeenCalledWith(
			new URLSearchParams('utm_campaign=marketing'),
			{
				replace: true,
			}
		)
	})
})
