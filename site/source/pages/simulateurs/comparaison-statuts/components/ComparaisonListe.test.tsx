import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

const documentationsAccessibles = async (
	user: ReturnType<typeof userEvent.setup>
) => {
	const infoBulles = await screen.findAllByRole('button', {
		name: /^Info sur/,
	})
	const chemins: string[] = []

	for (const infoBulle of infoBulles) {
		await user.click(infoBulle)
		await screen.findByRole('dialog')
		chemins.push(
			...screen
				.queryAllByRole('link')
				.map((lien) => lien.getAttribute('href') ?? '')
		)
		await user.keyboard('{Escape}')
	}

	return chemins
}

describe('Comparaison', () => {
	it('renvoie chaque valeur comparée vers la documentation de son modèle', async () => {
		const user = userEvent.setup()
		afficherLaComparaison()

		expect(await documentationsAccessibles(user)).toEqual(
			expect.arrayContaining([
				'/simulateurs/comparaison-régimes-sociaux/SASU/assimilé-salarié/rémunération/nette/après-impôt',
				'/simulateurs/comparaison-régimes-sociaux/EI/indépendant/rémunération/nette/après-impôt',
				'/simulateurs/comparaison-régimes-sociaux/AE/dirigeant/rémunération/net/après-impôt',
			])
		)
	}, 20_000)
})
