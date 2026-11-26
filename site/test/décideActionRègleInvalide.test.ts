import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { décideActionRègleInvalide } from '@/utils/publicodes/décideActionRègleInvalide'

const situationsVides = {
	situationDuSimulateur: {},
	situationDeConfiguration: {},
}

describe('décideActionRègleInvalide', () => {
	it('demande de retirer la règle et de la marquer obsolète si elle vient de la situation du simulateur', () => {
		const règle = 'salarié . contrat' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDuSimulateur: { [règle]: "'CDD'" },
		})

		expect(action).toEqual({ kind: 'omettre-et-marquer-obsolète', règle })
	})

	it("demande d'omettre la règle si elle vient de la situation de configuration du simulateur", () => {
		const règle = 'entreprise . EI' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDeConfiguration: { [règle]: 'oui' },
		})

		expect(action).toEqual({ kind: 'omettre', règle })
	})

	it("retourne une erreur inconnue si la règle n'est dans aucune des situations connues", () => {
		const règle = 'règle . inattendue' as DottedName

		const action = décideActionRègleInvalide(règle, situationsVides)

		expect(action).toEqual({ kind: 'erreur-inconnue', règle })
	})
})
