import { expect } from 'chai'
import { enrichRule } from '../source/engine/rules'
import { analyse, parseAll } from '../source/engine/traverse'
import { collectMissingVariables } from '../source/engine/generateQuestions'
import * as R from 'ramda'
import { isNumeric } from '../source/utils'
import expressions from './expressions.yaml'
import { nearley } from 'Engine/treat'

describe('Expressions', () =>
	expressions.map(expression =>
		it(expression, () => {
			let result = nearley().feed(expression).results

			expect(result).to.not.be.empty

			return null
			//TODO

			let [parseResult, ...additionnalResults] = result

			if (
				additionnalResults &&
				additionnalResults.length > 0 &&
				parseResult.category !== 'boolean'
			) {
				expect(target.nodeValue).to.be.closeTo(valeur, 0.001)
				expect(target).to.have.property('nodeValue', valeur)

				expect(missing).to.eql(expectedMissing)
			}
		})
	))
