import { render, screen } from '@testing-library/react'
import Engine from 'publicodes'
import { afterEach, describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { TestProvider } from '@/test/TestProvider'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { MessageDirigeantSASU } from './MessageDirigeantSASU'

const règles = {
	entreprise: { titre: 'Entreprise' },
	'entreprise . catégorie juridique': {
		titre: 'Catégorie juridique',
		question: 'Quelle est la catégorie juridique ?',
	},
}

const moteurAvec = (situation: Record<string, unknown>) =>
	(new Engine(règles) as Engine<DottedName>).setSituation(
		situation as Parameters<Engine<DottedName>['setSituation']>[0]
	)

const simulerUneVisiteDepuis = (referrer: string) =>
	Object.defineProperty(document, 'referrer', {
		value: referrer,
		configurable: true,
	})

const afficherLeMessage = (situation: Record<string, unknown> = {}) =>
	render(
		<TestProvider>
			<EngineProvider value={moteurAvec(situation)}>
				<MessageDirigeantSASU />
			</EngineProvider>
		</TestProvider>
	)

const leMessage = () =>
	screen.queryByRole('link', { name: /simulateur de revenu dédié/i })

afterEach(() => simulerUneVisiteDepuis(''))

describe('MessageDirigeantSASU', () => {
	it('invite le visiteur vers le simulateur de dirigeant de SASU', () => {
		afficherLeMessage()

		expect(leMessage()).toBeInTheDocument()
	})

	it("n'invite pas le visiteur venu de code.travail.gouv.fr, dont l'équipe ne souhaite pas référencer le simulateur de dirigeant de SASU", () => {
		simulerUneVisiteDepuis('https://code.travail.gouv.fr/outils/simulateur')

		afficherLeMessage()

		expect(leMessage()).not.toBeInTheDocument()
	})

	it("n'invite pas le visiteur qui a déjà renseigné sa catégorie juridique", () => {
		afficherLeMessage({ 'entreprise . catégorie juridique': "'SAS'" })

		expect(leMessage()).not.toBeInTheDocument()
	})
})
