import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { ComponentType, PropsWithChildren } from 'react'
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

const afficher = (Composant: ComponentType<PropsWithChildren>) => {
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
			afficher(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).Résumé
			)

			expect(
				screen.getByText(/Tout ce que votre entreprise encaisse/)
			).toBeInTheDocument()
		})

		it("n'affiche rien lorsque la règle n'a pas de description", () => {
			expect(
				afficher(
					documentationPublicodes(
						engine,
						'entreprise . sans documentation' as DottedName,
						'EI'
					).Résumé
				)
			).toBeEmptyDOMElement()
		})
	})

	describe('Références', () => {
		it('affiche les références à afficher hors du site de la BPI', () => {
			afficher(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).Références
			)

			expect(screen.getByText('Urssaf.fr')).toBeInTheDocument()
			expect(screen.queryByText('BPI France')).not.toBeInTheDocument()
		})

		it("n'affiche rien lorsque la règle n'a pas de référence", () => {
			expect(
				afficher(
					documentationPublicodes(
						engine,
						'entreprise . sans documentation' as DottedName,
						'EI'
					).Références
				)
			).toBeEmptyDOMElement()
		})
	})

	describe('chemin', () => {
		it("désigne la règle dans l'espace de documentation du modèle", () => {
			expect(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).chemin
			).toBe('EI/entreprise/chiffre')
		})

		it("se réduit à la règle lorsque le modèle n'a pas d'espace", () => {
			expect(
				documentationPublicodes(engine, 'entreprise . chiffre' as DottedName)
					.chemin
			).toBe('entreprise/chiffre')
		})
	})

	describe('titre', () => {
		it('reprend le titre de la règle', () => {
			expect(
				documentationPublicodes(
					engine,
					'entreprise . chiffre' as DottedName,
					'EI'
				).titre()
			).toBe("Chiffre d'affaires")
		})
	})
})
