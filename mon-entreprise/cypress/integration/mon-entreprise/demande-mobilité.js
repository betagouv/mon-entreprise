const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const DEMANDE_MOBILITE_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/demande-mobilité`

const writeFixtures = Cypress.env('record_http') !== undefined

describe(`Formulaire demande mobilité (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	if (!fr) {
		return
	}
	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = ['geo.api.gouv.fr']

	beforeEach(() => {
		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
		cy.visit(encodeURI('/gérer/demande-mobilité'))
	})
	afterEach(() => {
		cy.writeInterceptResponses(
			pendingRequests,
			responses,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
	})

	it('should not crash', () => {
		cy.contains('Demande de mobilité internationale')
	})
	it('should allow to complete and download', () => {
		// "coordonnées" section
		cy.contains('SIRET').click({ force: true })
		cy.focused()
			.type('684 064 0011')
			.tab()
			.type('Deaux')
			.tab()
			.type('Jean')
			.tab()
			.type('Française')
			.tab()
			.type('1991-07-25')
		cy.contains('sécurité sociale').click({ force: true })
		cy.focused().type('1 91 07 468 054 75')

		cy.tab().type('{downarrow}').wait(500)

		cy.focused().tab().type('Pouts').wait(2500).type('{enter}')

		cy.tab().type('{downarrow}').wait(500)

		cy.focused()
			.tab()
			.type('3 rue de la Rhumerie')
			.tab()
			.type('Brest')
			.wait(1500)
			.type('{enter}')
			.tab()
			.type('jean.deaux@gmail.com')
			.tab()
			.type('06 85 69 78 54')
			.tab()

		// "activité en France" section
		cy.focused()
			.type('Deaux & Fils')
			.tab()
			.type('14 chemin des Docks')
			.tab()
			.type('Bre')
			.wait(1500)
		cy.contains('29240').click()
		cy.contains('Organisme Urssaf').click({ force: true })
		cy.focused().type('Bretagne').tab().type('Boulangerie')

		// "votre demande" section
		// Oui x 4
		cy.focused()
			.tab()
			.type('{downArrow}{downArrow}')
			.wait(500)
			.tab()
			.type('{downArrow}{downArrow}')
			.wait(500)
			.tab()
			.type('{downArrow}{downArrow}')
			.wait(500)
			.tab()
			.type('{downArrow}{downArrow}')
			.wait(500)

		cy.get('#détachement\\ \\.\\ pays').wait(500).click()
		cy.focused().type('Irl').contains('Irlande').click()
		cy.focused()
			.tab()
			.type('2020-11-06')
			.tab()
			.type('2021-04-09')
			.tab()
			.type('Fabrications de gateaux bretons')

		// 2 x NON
		cy.tab().type('{downarrow}').wait(500)
		cy.tab().type('{downarrow}').wait(500)

		// download PDF
		cy.contains(
			'Je certifie l’exactitude des informations communiquées ci-dessus'
		).click()
		cy.contains('Fait à').click({ force: true })
		cy.focused().type('Plougastel')
		cy.contains('Générer la demande').click()
		cy.contains('Télécharger le fichier').click()
	})
})
