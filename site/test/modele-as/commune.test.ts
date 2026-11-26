import rules from 'modele-as'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Commune', () => {
	let engine: Engine
	beforeEach(() => {
		engine = new Engine(rules)
	})

	const RULE = 'établissement . commune'

	// NB: comme la règle n'a pas de valeur par défaut elle n'est pas "applicable"
	// tant qu'elle n'est pas répondue. On vérifie donc plutôt si elle vaut 'null'
	// (quand elle devrait être non applicable) ou 'undefined' (quand elle devrait
	// être applicable).

	it('n’est pas applicable par défaut', () => {
		expect(engine).toEvaluate(RULE, null)
	})

	it('n’est pas applicable pour le seuil d’effectif "moins de 11"', () => {
		const e = engine.setSituation({
			'entreprise . salariés . effectif . seuil': "'moins de 11'",
		})

		expect(e).toEvaluate(RULE, null)
	})

	it.each([
		['entre 11 et 19'],
		['entre 20 et 49'],
		['entre 50 et 249'],
		['entre 250 et 1999'],
		['plus de 2000'],
	])('est applicable pour le seuil d’effectif "%s"', (seuil) => {
		const e = engine.setSituation({
			'entreprise . salariés . effectif . seuil': `"${seuil}"`,
		})

		expect(e).toEvaluate(RULE, undefined)
	})
})
