import Engine from 'publicodes'
import { describe, expect, it, vi } from 'vitest'

import { safeSetSituation } from '@/utils/publicodes/safeSetSituation'

describe('safeSetSituation', () => {
	it("retire de la situation une règle qui n'existe plus (SituationError)", () => {
		const engine = new Engine({ a: 'oui', b: 'oui' })
		const onError = vi.fn()

		safeSetSituation(
			(s) => engine.setSituation(s),
			{
				a: 'non',
				'règle supprimée': 'oui',
			} as Record<string, string>,
			onError
		)

		expect(onError).toHaveBeenCalledWith(
			expect.objectContaining({
				faultyDottedName: 'règle supprimée',
			})
		)

		expect(engine.evaluate('a').nodeValue).toBe(false)
	})

	it('fonctionne sans callback onError', () => {
		const engine = new Engine({ a: 'oui' })

		safeSetSituation((s) => engine.setSituation(s), {
			a: 'non',
			'règle supprimée': 'oui',
		} as Record<string, string>)

		expect(engine.evaluate('a').nodeValue).toBe(false)
	})
})
