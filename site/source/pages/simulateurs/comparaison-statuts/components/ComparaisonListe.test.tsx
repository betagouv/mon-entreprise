import { render, screen, waitFor } from '@testing-library/react'
import * as O from 'effect/Option'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'

import {
	ComparateurProvider,
	ModèleAssimiléSalarié,
	ModèleAutoEntrepreneur,
	ModèleTravailleurIndépendant,
	useComparateur,
} from '@/contextes/comparateur'
import { eurosParAn } from '@/domaine/Montant'
import { TestProvider } from '@/test/TestProvider'

import { Comparaison } from './ComparaisonListe'

const ComparaisonPourUnChiffreDAffaires = () => {
	const { set, situation } = useComparateur()

	useEffect(() => {
		set.chiffreDAffaires(O.some(eurosParAn(50000)))
	}, [set])

	return O.isSome(situation.chiffreDAffaires) ? <Comparaison /> : null
}

const afficherLaComparaison = () =>
	render(
		<TestProvider>
			<ComparateurProvider
				modèles={[
					ModèleAssimiléSalarié,
					ModèleTravailleurIndépendant,
					ModèleAutoEntrepreneur,
				]}
			>
				<ComparaisonPourUnChiffreDAffaires />
			</ComparateurProvider>
		</TestProvider>
	)

const liensAffichés = () =>
	screen.getAllByRole('link').map((lien) => lien.getAttribute('href'))

describe('Comparaison', () => {
	it('renvoie chaque valeur comparée vers la documentation de son modèle', async () => {
		afficherLaComparaison()

		await waitFor(() => {
			expect(liensAffichés()).toEqual(
				expect.arrayContaining([
					'/SASU/assimilé-salarié/rémunération/nette/après-impôt',
					'/EI/indépendant/rémunération/nette/après-impôt',
					'/AE/dirigeant/rémunération/net/après-impôt',
				])
			)
		})
	})
})
