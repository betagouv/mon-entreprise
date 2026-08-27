import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'

import { documentationPublicodes } from './documentationPublicodes'

const règles = {
	entreprise: { titre: 'Entreprise' },
	'entreprise . chiffre': {
		titre: "Chiffre d'affaires",
		description: 'Tout ce que votre entreprise encaisse sur une année.',
		références: {
			'Urssaf.fr': 'https://www.urssaf.fr/portail/home.html',
			'BPI France': 'https://bpifrance-creation.fr/encyclopedie/statut',
		},
		valeur: 0,
	},
	'entreprise . sans documentation': {
		titre: 'Une règle non documentée',
		valeur: 0,
	},
}

const engine = () => new Engine(règles) as Engine<DottedName>

const afficher = (Composant: ComponentType) => {
	render(
		<TestProvider>
			<div data-testid="documentation">
				<Composant />
			</div>
		</TestProvider>
	)

	return screen.getByTestId('documentation')
}

describe('documentationPublicodes', () => {
	describe('Résumé', () => {
		it('affiche la description de la règle', () => {
			const { Résumé } = documentationPublicodes(
				engine,
				'entreprise . chiffre' as DottedName
			)

			afficher(Résumé)

			expect(
				screen.getByText(/Tout ce que votre entreprise encaisse/)
			).toBeInTheDocument()
		})

		it("n'affiche rien lorsque la règle n'a pas de description", () => {
			const { Résumé } = documentationPublicodes(
				engine,
				'entreprise . sans documentation' as DottedName
			)

			expect(afficher(Résumé)).toBeEmptyDOMElement()
		})
	})

	describe('Références', () => {
		it('affiche les références à afficher hors du site de la BPI', () => {
			const { Références } = documentationPublicodes(
				engine,
				'entreprise . chiffre' as DottedName
			)

			afficher(Références)

			expect(screen.getByText('Urssaf.fr')).toBeInTheDocument()
			expect(screen.queryByText('BPI France')).not.toBeInTheDocument()
		})

		it("n'affiche rien lorsque la règle n'a pas de référence", () => {
			const { Références } = documentationPublicodes(
				engine,
				'entreprise . sans documentation' as DottedName
			)

			expect(afficher(Références)).toBeEmptyDOMElement()
		})
	})
})
