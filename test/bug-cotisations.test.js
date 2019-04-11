import { expect } from 'chai'
import { enrichRule } from 'Engine/rules'
import { rules as realRules } from '../source/engine/rules'
import { analyse, analyseMany, parseAll } from '../source/engine/traverse'

describe('bug-analyse-many', function() {
	it.only('should compute the same contributions if asked with analyseMany or analyse', function() {
		const situationSelector = dottedName =>
			({
				'contrat salarié . salaire . net après impôt': 10000,
				'auto entrepreneur': 'non',
				'contrat salarié': 'oui',
				'contrat salarié . assimilé salarié': 'oui',
				'contrat salarié . ATMP . taux réduit': 'oui',
				'contrat salarié . CDD': 'non',
				'contrat salarié . indemnité kilométrique vélo . indemnité vélo active':
					'non',
				'contrat salarié . avantages en nature . montant': 0,
				'contrat salarié . temps partiel': 'non',
				'établissement . localisation': {},
				'contrat salarié . complémentaire santé . part employeur': 50,
				'contrat salarié . complémentaire santé . forfait . en france': 50,
				'entreprise . effectif': 1,
				'entreprise . association non lucrative': 'non'
			}[dottedName])
		const rules = parseAll(realRules.map(enrichRule))
		const targets = [
			"entreprise . chiffre d'affaires",
			'contrat salarié . cotisations'
		]
		const analyseManyValue = analyseMany(rules, targets)(situationSelector)
			.targets[1]
		const analyseValue = analyse(rules, 'contrat salarié . cotisations')(
			situationSelector
		).targets[0]
		expect(analyseManyValue.nodeValue).to.equal(analyseValue.nodeValue)
	})
})
