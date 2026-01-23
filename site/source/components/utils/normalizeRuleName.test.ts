import { describe, expect ,it} from "vitest"
import { normalizeRuleName } from "./normalizeRuleName"

describe('normalizeRuleName', () => {
	it('remplace les apostrophes par des underscores', () => {
		expect(normalizeRuleName("Chiffre d'affaires")).toEqual('Chiffre_d_affaires')
		expect(normalizeRuleName('Chiffre d’affaires')).toEqual('Chiffre_d_affaires')
	})
})
