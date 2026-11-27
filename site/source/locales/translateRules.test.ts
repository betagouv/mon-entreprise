import { Rule } from 'publicodes'
import { describe, expect, it } from 'vitest'

import translateRules, { Translation } from './translateRules'

const RÈGLE = 'salaire . brut'

const traduit = (règle: Rule, traduction: Translation) =>
	translateRules('en', { [RÈGLE]: traduction }, { [RÈGLE]: règle })[RÈGLE]

describe('translateRules', () => {
	it('remplace l’attribut par sa traduction', () => {
		expect(
			traduit({ titre: 'Salaire brut' }, { 'titre.en': 'Gross salary' }).titre
		).toBe('Gross salary')
	})

	it('retire la marque des traductions automatiques', () => {
		expect(
			traduit(
				{ titre: 'Salaire brut' },
				{ 'titre.en': '[automatic] Gross salary' }
			).titre
		).toBe('Gross salary')
	})

	it('garde l’attribut d’origine quand la traduction manque', () => {
		expect(traduit({ titre: 'Salaire brut' }, {}).titre).toBe('Salaire brut')
	})
})
