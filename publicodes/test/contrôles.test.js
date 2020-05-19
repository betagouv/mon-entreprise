import { expect } from 'chai'
import Engine, { parseRules } from '../source/index'

describe('controls', function() {
	let rawRules = {
		net: { formule: 'brut - cotisation' },
		cotisation: { formule: 235 },
		'résident en France': { formule: 'oui' },
		brut: {
			unité: '€',
			question: 'Quel est le salaire brut ?',
			contrôles: [
				{
					si: 'brut < 300',
					niveau: 'bloquant',
					message:
						'Malheureux, je crois que vous vous êtes trompé dans votre saisie.'
				},
				{
					si: 'brut < 1000',
					niveau: 'bloquant',
					message: 'Toujours pas, nous avons des standards en France !'
				},
				{
					si: 'brut < 1500',
					niveau: 'avertissement',
					message: 'Toujours pas, nous avons des standards en France !'
				},
				{
					si: 'brut > 100000',
					niveau: 'information',
					message: 'Oulah ! Oulah !'
				},
				{
					si: {
						'toutes ces conditions': ['brut > 1000000', 'résident en France']
					},
					niveau: 'information',
					message: 'Vous êtes un contribuable hors-pair !'
				}
			]
		}
	}

	it('Should parse blocking controls', function() {
		let controls = Object.values(parseRules(rawRules)).find(r => r.contrôles)
			.contrôles
		expect(
			controls.filter(({ level }) => level == 'bloquant')
		).to.have.lengthOf(2)
	})

	it('Should allow imbricated conditions', function() {
		const engine = new Engine(rawRules)
		let controls = engine.setSituation({ brut: 2000000 }).controls()
		expect(
			controls.find(
				({ message }) => message === 'Vous êtes un contribuable hors-pair !'
			)
		).to.exist

		let controls2 = engine.setSituation({ brut: 100001 }).controls()

		expect(controls2.find(({ message }) => message === 'Oulah ! Oulah !')).to
			.exist

		let controls3 = engine.setSituation({ brut: 100 }).controls()

		expect(
			controls3.find(
				({ message }) =>
					message ===
					'Malheureux, je crois que vous vous êtes trompé dans votre saisie.'
			)
		).to.exist
	})
})
