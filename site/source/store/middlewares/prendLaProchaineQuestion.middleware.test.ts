import { describe, expect, it } from 'vitest'

import { PublicodesSimulationConfig } from '@/domaine/PublicodesSimulationConfig'
import { configureLaSimulation } from '@/store/actions/actions'
import { makeStore } from '@/store/store'

const configAvecSituation = (
	situation: PublicodesSimulationConfig['situation']
): PublicodesSimulationConfig => ({
	nomModèle: 'modele-social',
	objectifs: ['dirigeant . régime social'],
	situation,
})

const nombreMaximumDeMisesÀJour = 50

const créeUnStoreQuiCompteSesMisesÀJour = () => {
	const store = makeStore()
	let misesÀJour = 0
	store.subscribe(() => {
		misesÀJour++
		// Interrompt une éventuelle boucle de dispatchs, qui ne laisserait
		// jamais la main au délai du test.
		if (misesÀJour > nombreMaximumDeMisesÀJour) {
			throw new Error('Les questions suivantes se mettent à jour en boucle')
		}
	})

	return { store, misesÀJour: () => misesÀJour }
}

describe('prendLaProchaineQuestionMiddleware', () => {
	it('ne relance pas indéfiniment les mises à jour de deux stores configurés en même temps', async () => {
		const premier = créeUnStoreQuiCompteSesMisesÀJour()
		const second = créeUnStoreQuiCompteSesMisesÀJour()

		await Promise.all([
			premier.store.dispatch(
				configureLaSimulation(
					configAvecSituation({
						'entreprise . date de création': '01/01/2024',
					}),
					'/premier',
					'premier'
				)
			),
			second.store.dispatch(
				configureLaSimulation(
					configAvecSituation({
						'entreprise . date de création': '01/01/2025',
					}),
					'/second',
					'second'
				)
			),
		])
		await new Promise((resolve) => setTimeout(resolve, 100))

		expect(premier.misesÀJour()).toBeLessThan(nombreMaximumDeMisesÀJour)
		expect(second.misesÀJour()).toBeLessThan(nombreMaximumDeMisesÀJour)
		expect(premier.store.getState().simulation?.questionsSuivantes).toEqual(
			expect.any(Array)
		)
	})
})
