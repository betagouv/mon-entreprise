import { describe, expect, it } from 'vitest'

import { generatePath, matchPath } from './pathUtils'

describe('matchPath', () => {
	it('matche un chemin exact', () => {
		expect(matchPath('/simulateurs', '/simulateurs')).toEqual({ params: {} })
	})

	it('retourne null si le chemin ne matche pas', () => {
		expect(matchPath('/simulateurs', '/assistants')).toBeNull()
	})

	it('matche un paramètre dynamique', () => {
		expect(matchPath('/simulateurs/:slug', '/simulateurs/salaire')).toEqual({
			params: { slug: 'salaire' },
		})
	})

	it('matche plusieurs paramètres dynamiques', () => {
		expect(matchPath('/a/:x/b/:y', '/a/1/b/2')).toEqual({
			params: { x: '1', y: '2' },
		})
	})

	it('retourne null si le nombre de segments diffère', () => {
		expect(matchPath('/a/:x', '/a/1/extra')).toBeNull()
	})

	it('matche un wildcard', () => {
		expect(matchPath('/iframes/*', '/iframes/simulateur/salaire')).toEqual({
			params: { '*': 'simulateur/salaire' },
		})
	})

	it('matche un wildcard sur le préfixe exact', () => {
		expect(matchPath('/iframes/*', '/iframes')).toEqual({
			params: { '*': '' },
		})
		expect(matchPath('/iframes/*', '/iframes/')).toEqual({
			params: { '*': '' },
		})
	})

	it('retourne null si le wildcard ne matche pas', () => {
		expect(matchPath('/iframes/*', '/autres/page')).toBeNull()
	})

	it('ignore le trailing slash dans le pathname', () => {
		expect(matchPath('/simulateurs', '/simulateurs/')).toEqual({ params: {} })
	})

	it('ignore le trailing slash dans le pattern', () => {
		expect(matchPath('/simulateurs/', '/simulateurs')).toEqual({ params: {} })
	})
})

describe('generatePath', () => {
	it('retourne le pattern sans params', () => {
		expect(generatePath('/simulateurs')).toBe('/simulateurs')
	})

	it('remplace un paramètre', () => {
		expect(generatePath('/simulateurs/:slug', { slug: 'salaire' })).toBe(
			'/simulateurs/salaire'
		)
	})

	it('remplace plusieurs paramètres', () => {
		expect(generatePath('/a/:x/b/:y', { x: '1', y: '2' })).toBe('/a/1/b/2')
	})
})
