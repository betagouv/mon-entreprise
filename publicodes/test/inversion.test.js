import { expect } from 'chai'
import dedent from 'dedent-js'
import Engine from '../source/index'

describe('inversions', () => {
	it('should handle non inverted example', () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: brut
              taux: 77%

        brut:
          unité: €
      `
		const result = new Engine(rules)
			.setSituation({ brut: 2300 })
			.evaluate('net')

		expect(result.nodeValue).to.be.closeTo(1771, 0.001)
	})

	it('should handle simple inversion', () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: brut
              taux: 77%

        brut:
          unité: €
          formule:
            inversion numérique:
              avec:
                - net
      `
		const result = new Engine(rules)
			.setSituation({ net: 2000 })
			.evaluate('brut')

		expect(result.nodeValue).to.be.closeTo(2000 / (77 / 100), 0.0001 * 2000)
	})

	it('should handle inversion with value at 0', () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: brut
              taux: 77%

        brut:
          unité: €
          formule:
            inversion numérique:
              avec:
                - net
      `
		const result = new Engine(rules).setSituation({ net: 0 }).evaluate('brut')

		expect(result.nodeValue).to.be.closeTo(0, 0.0001)
	})

	it('should ask the input of one of the possible inversions', () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: assiette
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - sinon:
                    taux: 70%

        brut:
          unité: €
          formule:
            inversion numérique:
              avec:
                - net
        cadre:
        assiette:
          formule: 67€ + brut

      `
		const result = new Engine(rules).evaluate('brut')

		expect(result.nodeValue).to.be.null
		expect(Object.keys(result.missingVariables)).to.include('brut')
	})

	it('should handle inversions with missing variables', () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: assiette
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - sinon:
                    taux: 70%

        brut:
          unité: €
          formule:
            inversion numérique:
              avec:
                - net
        cadre:
        assiette:
          formule:
            somme:
              - 1200
              - brut
              - taxeOne
        taxeOne:
          non applicable si: cadre
          formule: taxe + taxe
        taxe:
          formule:
            produit:
              assiette: 1200 €
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - sinon:
                    taux: 70%
      `
		const result = new Engine(rules)
			.setSituation({ net: 2000 })
			.evaluate('brut')
		expect(result.nodeValue).to.be.null
		expect(Object.keys(result.missingVariables)).to.include('cadre')
	})

	it("shouldn't report a missing salary if another salary was input", () => {
		const rules = dedent`
        net:
          formule:
            produit:
              assiette: assiette
              variations:
                - si: cadre
                  alors:
                    taux: 80%
                - si: cadre != oui
                  alors:
                    taux: 70%

        total:
          formule:
            produit:
              assiette: assiette
              taux: 150%

        brut:
          unité: €
          formule:
            inversion numérique:
              avec:
                - net
                - total

        cadre:

        assiette:
          formule: 67 + brut

      `
		const result = new Engine(rules)
			.setSituation({ net: 2000, cadre: 'oui' })
			.evaluate('total')
		expect(result.nodeValue).to.be.closeTo(3750, 1)
		expect(Object.keys(result.missingVariables)).to.be.empty
	})

	it('complex inversion with composantes', () => {
		const rules = dedent`
      net:
        formule:
          produit:
            assiette: 67 + brut
            taux: 80%

      cotisation:
        formule:
          produit:
            assiette: 67 + brut
            composantes:
              - attributs:
                  dû par: employeur
                taux: 100%
              - attributs:
                  dû par: salarié
                taux: 50%

      total:
        formule: cotisation .employeur + cotisation .salarié

      brut:
        unité: €
        formule:
          inversion numérique:
            avec:
              - net
              - total
    `
		const result = new Engine(rules)
			.setSituation({ net: 2000 })
			.evaluate('total')
		expect(result.nodeValue).to.be.closeTo(3750, 1)
		expect(Object.keys(result.missingVariables)).to.be.empty
	})
})
