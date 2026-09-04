import { render, screen, waitFor } from '@testing-library/react'
import * as O from 'effect/Option'
import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'

import { DocumentationBasePathProvider } from '@/components/documentation/DocumentationBasePathProvider'
import {
	ComparateurProvider,
	ModèleAssimiléSalarié,
	ModèleAutoEntrepreneur,
	ModèleTravailleurIndépendant,
	useComparateur,
} from '@/contextes/comparateur'
import { eurosParAn } from '@/domaine/MontantRecurrent'
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
			<DocumentationBasePathProvider basePath="/simulateurs/comparaison-régimes-sociaux">
				<ComparateurProvider
					modèles={[
						ModèleAssimiléSalarié,
						ModèleTravailleurIndépendant,
						ModèleAutoEntrepreneur,
					]}
				>
					<ComparaisonPourUnChiffreDAffaires />
				</ComparateurProvider>
			</DocumentationBasePathProvider>
		</TestProvider>
	)

const liensAffichés = () =>
	screen.getAllByRole('link').map((lien) => lien.getAttribute('href'))

describe('Comparaison', () => {
	it('renvoie chaque valeur comparée vers la documentation de son modèle', async () => {
		afficherLaComparaison()

		await waitFor(() =>
			expect(liensAffichés()).toEqual(
				expect.arrayContaining([
					'/simulateurs/comparaison-régimes-sociaux/SASU/assimilé-salarié/rémunération/nette/après-impôt',
					'/simulateurs/comparaison-régimes-sociaux/EI/indépendant/rémunération/nette/après-impôt',
					'/simulateurs/comparaison-régimes-sociaux/AE/dirigeant/rémunération/net/après-impôt',
				])
			)
		)
	})
})
