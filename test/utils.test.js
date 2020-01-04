var assert = require('assert')

const utils = require('../source/utils')

describe('capitalise0', function() {
	it('should turn the first character into its capital', function() {
		assert.equal('Salaire', utils.capitalise0('salaire'))
	})
})
