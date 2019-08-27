import { expect } from 'chai'
import dedent from 'dedent-js'
import { enrichRule } from 'Engine/rules'
import { safeLoad } from 'js-yaml'
import { rules as realRules } from '../source/engine/rules'
import { analyse, analyseMany, parseAll } from '../source/engine/traverse'

describe('bug-analyse-many', function() {
	it('complex inversion with composantes', () => {
		let rawRules = dedent`
      - nom: net
        formule: brut - cotisations
      - nom: cotisations
        formule:
          somme:
            - cotisation a [salarié]
            - cotisation b

      - nom: cotisation a
        formule:
          multiplication:
            assiette: brut
            composantes:
              - attributs:
                  dû par: employeur
                taux: 10%
              - attributs:
                  dû par: salarié
                taux: 10%

      - nom: cotisation b
        formule:
          multiplication:
            assiette: brut
            composantes:
              - attributs:
                  impôt sur le revenu: x
                taux: 10%
              - attributs:
                  impôt sur le revenu: y
                taux: 10%


      - nom: brut
        unité: €
        formule:
          inversion numérique:
            avec:
              - net
    `,
			rules = parseAll(safeLoad(rawRules).map(enrichRule)),
			stateSelector = name => ({ net: 700 }[name])
		const targets = ['brut', 'cotisations']
		const many = analyseMany(rules, targets)(stateSelector).targets

		const one = analyse(rules, 'cotisations')(stateSelector).targets[0]

		//console.log(many[0].nodeValue, many[1].nodeValue, one.nodeValue)
		expect(many[1].nodeValue).to.be.closeTo(one.nodeValue, 0.1)
	})
	it('should compute the same contributions if asked with analyseMany or analyse', function() {
		const situationSelector = dottedName =>
			({
				'contrat salarié . rémunération . net de cotisations': 3500,
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
			'contrat salarié . rémunération . brut de base',
			'contrat salarié . cotisations . salariales'
		]
		const analyseManyValue = analyseMany(rules, targets)(situationSelector)
			.targets[1]
		const analyseValue = analyse(
			rules,
			'contrat salarié . cotisations . salariales'
		)(situationSelector).targets[0]

		console.log(analyseManyValue.nodeValue, analyseValue.nodeValue)
		expect(analyseManyValue.nodeValue).to.equal(analyseValue.nodeValue)
	})
})
