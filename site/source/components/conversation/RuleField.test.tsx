import { render, screen } from '@testing-library/react'
import rules from 'modele-social'
import { describe, expect, it, vi } from 'vitest'

import { TestProvider } from '@/test/TestProvider'
import { EngineProvider } from '@/utils/publicodes/EngineContext'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import { RuleField } from './RuleField'

describe('RuleField', () => {
	it('nomme le champ de recherche d’une question à une possibilité affichée en recherche', () => {
		render(
			<TestProvider>
				<EngineProvider value={engineFactory(rules, 'modele-social')}>
					<RuleField
						dottedName="établissement . code risque"
						labelOrLegend="De quel domaine d'activité dépend votre entreprise ?"
						onChange={vi.fn()}
					/>
				</EngineProvider>
			</TestProvider>
		)

		expect(
			screen.getByRole('searchbox', {
				name: "De quel domaine d'activité dépend votre entreprise ?",
			})
		).toBeInTheDocument()
	})
})
