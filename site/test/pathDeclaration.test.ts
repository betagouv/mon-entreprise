import { describe, expect, it } from 'vitest'

import { translatedPathFrom } from '../build/pathDeclaration'

describe('translatedPathFrom', () => {
	it('retourne le chemin déclaré', () => {
		expect(translatedPathFrom({ englishPath: 'salary' }, 'path.ts')).toBe(
			'salary'
		)
	})

	it.each([
		['un export absent', {}],
		['un export vide', { englishPath: '' }],
		['un export qui n’est pas une chaîne', { englishPath: 42 }],
		['un module absent', undefined],
	])('refuse %s en nommant le fichier fautif', (_, declaration) => {
		expect(() => translatedPathFrom(declaration, 'app/x/path.ts')).toThrow(
			'app/x/path.ts'
		)
	})
})
