import { describe, expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { décideActionRègleInvalide } from '@/utils/publicodes/décideActionRègleInvalide'

const situationsVides = {
	situationDuSimulateur: {},
	situationDeLEntreprise: {},
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

	it("demande de réinitialiser l'entreprise si la règle fait partie de l'identité de l'entreprise", () => {
		const règle = 'entreprise . SIREN' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDeLEntreprise: { [règle]: "'TAURUS'" },
		})

		expect(action).toEqual({ kind: 'réinitialiser-entreprise', règle })
	})

	it("priorise la réinitialisation de l'entreprise sur l'omission si la règle est aussi une saisie", () => {
		const règle = 'entreprise . catégorie juridique' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDuSimulateur: { [règle]: "'SAS'" },
			situationDeLEntreprise: { [règle]: "'SAS'" },
		})

		expect(action).toEqual({ kind: 'réinitialiser-entreprise', règle })
	})

	it("demande d'omettre la règle si elle vient d'une saisie utilisateur dans la situation de l’entreprise", () => {
		const règle = 'entreprise . activité . nature' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDeLEntreprise: { [règle]: "'libérale'" },
		})

		expect(action).toEqual({ kind: 'omettre', règle })
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

	it('priorise la situation du simulateur sur celle de l’entreprise si la règle est dans les deux', () => {
		const règle = 'entreprise . salariés' as DottedName

		const action = décideActionRègleInvalide(règle, {
			...situationsVides,
			situationDuSimulateur: { [règle]: 'oui' },
			situationDeLEntreprise: { [règle]: 'non' },
		})

		expect(action).toEqual({ kind: 'omettre-et-marquer-obsolète', règle })
	})
})
