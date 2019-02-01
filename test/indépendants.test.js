import { expect } from 'chai';
import Syso from '../source/engine/index';

describe('indeps', function() {
	it.only('should compute income for indépendant', function() {
		let values = Syso.evaluate(
			['revenu disponible'],
			{ "entreprise . chiffre d'affaires": 70000,
			'entreprise . charges' : 2000,
				indépendant: 'oui',
				'auto-entrepreneur': 'non',
				'contrat salarié': 'non',
				période: 'année'
		   }
		)

		expect(values[0]).to.equal(42166)
	})
})
