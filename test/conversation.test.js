import { expect } from 'chai'
import { getNextQuestions } from '../source/components/utils/useNextQuestion'
import Engine from 'Engine'

describe('conversation', function() {
	it('should start with the first missing variable', function() {
		const missingVariables = new Engine({
			// TODO - this won't work without the indirection, figure out why
			'top . startHere': { formule: { somme: ['a', 'b'] } },
			'top . a': { formule: 'aa' },
			'top . b': { formule: 'bb' },
			'top . aa': { question: '?', titre: 'a', unité: '€' },
			'top . bb': { question: '?', titre: 'b', unité: '€' }
		}).evaluate('top . startHere').missingVariables
		expect(getNextQuestions([missingVariables])[0]).to.equal('top . aa')
	})
	it('should first ask for questions without defaults, then those with defaults', function() {
		const engine = new Engine({
			net: { formule: 'brut - cotisation' },
			brut: {
				question: 'Quel est le salaire brut ?',
				unité: '€/an'
			},
			cotisation: {
				formule: {
					produit: {
						assiette: 'brut',
						variations: [
							{
								si: 'cadre',
								alors: {
									taux: '77%'
								}
							},
							{
								sinon: {
									taux: '80%'
								}
							}
						]
					}
				}
			},
			cadre: {
				question: 'Est-ce un cadre ?',
				'par défaut': 'non'
			}
		})

		expect(
			getNextQuestions([engine.evaluate('net').missingVariables])[0]
		).to.equal('brut')

		engine.setSituation({
			brut: 2300
		})

		expect(
			getNextQuestions([engine.evaluate('net').missingVariables])[0]
		).to.equal(undefined)

		expect(
			getNextQuestions([
				engine.evaluate('net', { useDefaultValues: false }).missingVariables
			])[0]
		).to.equal('cadre')
	})
})
