import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from 'vitest'

import { parseRouteHrefs } from './routeHrefs'

describe('parseRouteHrefs', () => {
	let warn: MockInstance

	beforeEach(() => {
		warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
	})

	afterEach(() => {
		warn.mockRestore()
	})

	it('lit la table sérialisée par le build', () => {
		expect(
			parseRouteHrefs('{"/simulateurs/salaire-brut-net":"/calculators/salary"}')
		).toEqual({ '/simulateurs/salaire-brut-net': '/calculators/salary' })
	})

	it('donne une table vide quand la variable est absente', () => {
		expect(parseRouteHrefs(undefined)).toEqual({})
	})

	it('donne une table vide quand la valeur n’est pas du JSON', () => {
		expect(parseRouteHrefs('{')).toEqual({})
	})

	it('donne une table vide quand le JSON ne décrit pas un objet', () => {
		expect(parseRouteHrefs('["/documentation"]')).toEqual({})
		expect(parseRouteHrefs('null')).toEqual({})
		expect(parseRouteHrefs('"/documentation"')).toEqual({})
	})

	it('donne une table vide quand un lien n’est pas une chaîne', () => {
		expect(parseRouteHrefs('{"/documentation":42}')).toEqual({})
	})

	it('avertit au lieu d’échouer silencieusement', () => {
		parseRouteHrefs('{')

		expect(warn).toHaveBeenCalled()
	})
})
