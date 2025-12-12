import { describe, expect, it } from 'vitest'

import { PLAFOND_ANNUEL_SECURITE_SOCIALE } from './ConstantesSociales'

describe('ConstantesSociales', () => {
	it("PLAFOND_ANNUEL_SECURITE_SOCIALE doit avoir une valeur pour l'année courante", () => {
		const annéeCourante = new Date().getFullYear()

		expect(PLAFOND_ANNUEL_SECURITE_SOCIALE[annéeCourante]).toBeDefined()
	})
})
